import fs from "fs";
import path from "path";
import { redis_rateLimit } from "../utils/redisClient";

let scriptSha: string;

export async function loadRateLimiterScript() {
    const luaPath = path.join(process.cwd(), "src/scripts/rateLimiter.lua");
    const luaScript = fs.readFileSync(luaPath, "utf-8");

    scriptSha = await redis_rateLimit.scriptLoad(luaScript);

    console.log("✅ Lua script loaded:", scriptSha);
}

export { scriptSha };   