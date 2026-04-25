local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local bucket = redis.call("HMGET", key, "tokens", "last_refill")

local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

redis.call("INCR", "rate_limiter_calls")

if not tokens or not last_refill then
    tokens = capacity
    last_refill = now
end

local delta = math.max(0, now - last_refill)
local refill = delta * refill_rate

tokens = math.min(capacity, tokens + refill)
    
if tokens < requested then
    return { 0, tokens }
end
tokens = tokens - requested
redis.call("HSET", key, "tokens", tokens, "last_refill", now, "requested", requested)

redis.call("EXPIRE", key, 60)

return { 1, tokens }
