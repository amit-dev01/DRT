-- Weighted previous/current fixed buckets, atomically evaluated. Approximate sliding window.
-- A single hash allows safe bucket rotation inside the same atomic operation.
local t = redis.call('TIME')
local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
local windowMs = tonumber(ARGV[1])
local maxRequests = tonumber(ARGV[2])
local bucket = math.floor(now / windowMs)
local elapsed = now - bucket * windowMs
local storedBucket = tonumber(redis.call('HGET', KEYS[1], 'bucket'))
local currentCount = tonumber(redis.call('HGET', KEYS[1], 'current')) or 0
local previousCount = tonumber(redis.call('HGET', KEYS[1], 'previous')) or 0
