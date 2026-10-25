-- Exact sliding log. Unique members prevent same-millisecond requests overwriting each other.
local t = redis.call('TIME')
local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
local windowMs = tonumber(ARGV[1])
local maxRequests = tonumber(ARGV[2])
local member = ARGV[3]
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - windowMs)
local count = redis.call('ZCARD', KEYS[1])
local allowed = 0
local retryMs = 0
if count < maxRequests then
  redis.call('ZADD', KEYS[1], now, member)
  count = count + 1
  allowed = 1
