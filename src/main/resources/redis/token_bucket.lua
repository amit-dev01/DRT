-- Redis TIME is the shared clock. One Lua execution serializes refill and consume.
local t = redis.call('TIME')
local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
local capacity = tonumber(ARGV[1])
local refillPerMs = tonumber(ARGV[2]) / 1000
local cost = tonumber(ARGV[3])
local ttlMs = tonumber(ARGV[4])
local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens')) or capacity
local last = tonumber(redis.call('HGET', KEYS[1], 'timestamp')) or now
-- Clamp negative elapsed time defensively; Redis TIME itself avoids gateway-node clock skew.
local elapsed = math.max(0, now - last)
tokens = math.min(capacity, tokens + elapsed * refillPerMs)
local allowed = 0
local retryMs = 0
if tokens >= cost then
  tokens = tokens - cost
