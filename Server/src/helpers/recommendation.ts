import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { redis } from "../utils/redisClient"; // your connection
dayjs.extend(utc);

/**
 * Get top N trending courses for a category over the last `hours` hours.
 * - Filters out empty/non-existing hourly buckets before zUnionStore.
 * - Optionally applies exponential decay (recent hours weigh more).
 */
export async function getTrendingCategory(
  categoryId: string,
  hours = 1,
  topN = 10,
  useDecay = false
) {
  if (hours <= 0) hours = 1;

  const now = dayjs().utc();
  // Build bucket keys newest -> oldest (index 0 = current hour)
  const allKeys = Array.from({ length: hours }, (_, i) => {
    const bucket = now.subtract(i, "hour").format("YYYYMMDDHH");
    return `trending:category:${categoryId}:${bucket}`;
  });

  // Check which keys actually exist (small number of calls usually)
  const existsArr = await Promise.all(allKeys.map((k) => redis.exists(k)));
  const existingKeys = allKeys.filter((_, i) => existsArr[i] === 1);

  if (existingKeys.length === 0) {
    // no data found in any bucket
    return [];
  }

  // Build weights (optional): newest hour gets weight 1, previous gets 0.8^i etc.
  const weights = existingKeys.map((_, i) =>
    useDecay ? Math.pow(0.8, i) : 1
  );

  // destination temp key (short lived)
  const destKey = `trending:category:${categoryId}:last${hours}h:tmp:${Date.now()}`;

  // Build ZKeys array: [{ key, weight }, ...]
  const zkeys = existingKeys.map((k, i) => ({ key: k, weight: weights[i] }));

  // TypeScript expects a tuple type here; cast is required because we build dynamically.
  // This cast is safe: shape matches Redis ZKeyAndWeight objects.
  await redis.zUnionStore(
    destKey,
    zkeys as unknown as [Redis.ZKeyAndWeight, ...Redis.ZKeyAndWeight[]]
  );

  // expire the temp aggregate quickly (avoid leaking temporary keys)
  await redis.expire(destKey, 60); // 60 seconds

  // fetch topN from the aggregated zset (highest score first)
  const raw = await redis.zRange(destKey, 0, topN - 1, {
    REV: true,
    WITHSCORES: true,
  });

  // Normalize node-redis return shape to an array of { member, score }
  // NOTE: node-redis returns an array of objects when WITHSCORES is used (each { value, score })
  const results =
    Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object"
      ? (raw as { value: string; score: string }[]).map((r) => ({
          member: r.value,
          score: Number(r.score),
        }))
      : // fallback: if client returns flat string array, convert accordingly
        (raw as string[]).reduce<{ member: string; score: number }[]>(
          (acc, v, idx) => {
            if (idx % 2 === 0) acc.push({ member: v, score: Number(raw[idx + 1]) });
            return acc;
          },
          []
        );

  return results;
}
