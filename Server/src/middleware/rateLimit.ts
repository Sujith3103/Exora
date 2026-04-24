import { NextFunction, Request, Response } from "express";
import { redis_rateLimit } from "../utils/redisClient";
import { scriptSha } from "../helpers/loadRateLimiterScript";

export const rateLimit = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id || req.ip;

            const key = `rate_limit:user:${userId}:path:${req.path}`;

            const capacity = req.method === "GET" ? 5 : 2;
            const refillRate = req.method === "GET" ? 2 : 1;

            const now = Math.floor(Date.now() / 1000);

            const [allowed, tokens] = await redis_rateLimit.evalSha(
                scriptSha,
                {
                    keys: [key],
                    arguments: [
                        capacity.toString(),
                        refillRate.toString(),
                        now.toString(),
                        "1",
                    ], 
                }
            ) as [number, number];

            if (allowed === 0) {
                return res.status(429).json({
                    message: "Too many requests",
                    tokensLeft: tokens,
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};