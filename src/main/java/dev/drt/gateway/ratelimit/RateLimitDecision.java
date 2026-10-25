package dev.drt.gateway.ratelimit;

public record RateLimitDecision(boolean allowed, long remaining, long retryAfterMillis, long limit) { }
