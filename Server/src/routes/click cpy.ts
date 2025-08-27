// src/routes/recommendations.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();
const router = Router();

/**
 * GET /recommendations/for-you/:userId?limit=10&days=30
 * - Real-time, content-based "For You"
 * - Uses category + instructor signals, action weights, and recency decay
 */
router.get("/for-you/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10))); // clamp 1..50
    const days = Math.max(1, Math.min(180, Number(req.query.days ?? 30)));  // clamp 1..180
    const sinceISO = dayjs().subtract(days, "day").toISOString();

    // 1) pull the user's recent interactions
    const clicks = await prisma.userClick.findMany({
      where: {
        userId,
        timestamp: { gte: new Date(sinceISO) },
        // consider only course-related rows to build the profile
        OR: [{ clickType: "course" }, { courseId: { not: null } }],
      },
      select: {
        courseId: true,
        categoryId: true,
        instructorId: true,
        action: true,
        timestamp: true,
        targetId: true,
      },
      orderBy: { timestamp: "desc" },
      take: 500, // safety cap
    });

    // track the courses already interacted with to avoid recommending again
    const seenCourseIds = new Set<string>();
    for (const c of clicks) {
      if (c.courseId) seenCourseIds.add(c.courseId);
      // if data landed as targetId for course clicks, capture that too
      if (!c.courseId && c.targetId) seenCourseIds.add(c.targetId);
    }

    // 2) if no history → fallback to trending
    if (clicks.length === 0) {
      const trending = await prisma.course.findMany({
        where: { status: "published" },
        include: {
          CourseAnalytics: true,
        },
        orderBy: [{ CourseAnalytics: { trending: "desc" } }, { createdAt: "desc" }],
        take: limit,
      });

      return res.json({
        userId,
        mode: "fallback_trending",
        recommendations: trending.map((c) => ({
          courseId: c.id,
          title: c.title,
          category: c.category,
          instructorId: c.instructorId,
          score: c.CourseAnalytics?.trending ?? 0,
          reason: "Top trending (no recent user activity)",
        })),
      });
    }

    // 3) build user preference profiles with action weights + recency decay
    const ACTION_WEIGHT: Record<string, number> = {
      view: 0.5,
      click: 1.0,
      share: 1.2,
      enroll: 2.0,
    };

    // exponential decay half-life ~ 7 days (tunable)
    const HALF_LIFE_DAYS = 7;
    const lambda = Math.log(2) / HALF_LIFE_DAYS;

    const categoryPref = new Map<string, number>();
    const instructorPref = new Map<string, number>();

    for (const ev of clicks) {
      const action = (ev.action ?? "click").toLowerCase();
      const baseW = ACTION_WEIGHT[action] ?? 1.0;
      const ageDays = Math.max(
        0,
        (Date.now() - new Date(ev.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      );
      const recency = Math.exp(-lambda * ageDays); // 1 for today, drops over time
      const weight = baseW * recency;

      if (ev.categoryId) {
        categoryPref.set(ev.categoryId, (categoryPref.get(ev.categoryId) ?? 0) + weight);
      }
      if (ev.instructorId) {
        instructorPref.set(ev.instructorId, (instructorPref.get(ev.instructorId) ?? 0) + weight);
      }
    }

    // normalize prefs to [0,1] per group for stability
    function normalize(m: Map<string, number>) {
      let max = 0;
      for (const v of m.values()) max = Math.max(max, v);
      if (max === 0) return;
      for (const [k, v] of m.entries()) m.set(k, v / max);
    }
    normalize(categoryPref);
    normalize(instructorPref);

    // 4) fetch candidate courses (published), exclude already-seen
    //    optional narrowing: only categories present in user history if available
    const interestedCategories = Array.from(categoryPref.keys());
    const whereCategory =
      interestedCategories.length > 0
        ? { category: { in: interestedCategories } }
        : {}; // if empty, don't filter — allows discovery

    const candidates = await prisma.course.findMany({
      where: {
        status: "published",
        id: { notIn: Array.from(seenCourseIds) },
        ...whereCategory,
      },
      include: {
        CourseAnalytics: true,
      },
      take: 1000, // safety cap; scoring done in-app
    });

    // 5) precompute normalization for trending (if present)
    let trendingMin = Infinity;
    let trendingMax = -Infinity;
    for (const c of candidates) {
      const t = c.CourseAnalytics?.trending ?? 0;
      trendingMin = Math.min(trendingMin, t);
      trendingMax = Math.max(trendingMax, t);
    }
    const normTrending = (t: number) => {
      if (!isFinite(trendingMin) || !isFinite(trendingMax) || trendingMax === trendingMin) return 0;
      return (t - trendingMin) / (trendingMax - trendingMin);
    };

    // 6) scoring function
    const W_CATEGORY = 0.6;
    const W_INSTRUCTOR = 0.3;
    const W_TRENDING = 0.1;

    type Scored = {
      courseId: string;
      title: string;
      category: string;
      instructorId: string;
      score: number;
      parts: { category: number; instructor: number; trending: number };
      reason: string;
    };

    const scored: Scored[] = candidates.map((c) => {
      const catScore = categoryPref.get(c.category) ?? 0;
      const instScore = instructorPref.get(c.instructorId) ?? 0;
      const trendScore = normTrending(c.CourseAnalytics?.trending ?? 0);

      const finalScore = W_CATEGORY * catScore + W_INSTRUCTOR * instScore + W_TRENDING * trendScore;

      // simple human-readable reason
      const reasons: string[] = [];
      if (catScore > 0) reasons.push(`matches your interest in "${c.category}"`);
      if (instScore > 0) reasons.push(`you engage with this instructor`);
      if (reasons.length === 0) reasons.push(`popular now in the platform`);

      return {
        courseId: c.id,
        title: c.title,
        category: c.category,
        instructorId: c.instructorId,
        score: Number(finalScore.toFixed(6)),
        parts: {
          category: Number((W_CATEGORY * catScore).toFixed(6)),
          instructor: Number((W_INSTRUCTOR * instScore).toFixed(6)),
          trending: Number((W_TRENDING * trendScore).toFixed(6)),
        },
        reason: reasons.join(" • "),
      };
    });

    // 7) sort & (optional) diversify so we don't spam a single instructor
    scored.sort((a, b) => b.score - a.score);

    // simple MMR-like diversification by instructor (cap 3 per instructor in top list)
    const final: Scored[] = [];
    const instructorCap = 3;
    const instructorCount = new Map<string, number>();

    for (const item of scored) {
      const cnt = instructorCount.get(item.instructorId) ?? 0;
      if (cnt >= instructorCap) continue;
      instructorCount.set(item.instructorId, cnt + 1);
      final.push(item);
      if (final.length >= limit) break;
    }

    // if diversification pruned too much, backfill from the remainder
    if (final.length < limit) {
      for (const item of scored) {
        if (final.find((x) => x.courseId === item.courseId)) continue;
        final.push(item);
        if (final.length >= limit) break;
      }
    }

    return res.json({
      userId,
      mode: "content_based_realtime",
      windowDays: days,
      weights: { category: W_CATEGORY, instructor: W_INSTRUCTOR, trending: W_TRENDING },
      recommendations: final,
      debug: {
        seenCourseCount: seenCourseIds.size,
        categoryPref: Object.fromEntries(categoryPref.entries()),
        instructorPref: Object.fromEntries(instructorPref.entries()),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

export default router;
