package dev.drt.gateway.ratelimit;

import dev.drt.gateway.config.RateLimitProperties;
import dev.drt.gateway.config.RateLimitProperties.Policy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.scripting.support.ResourceScriptSource;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Component
public class RedisRateLimiter {
    private final ReactiveStringRedisTemplate redis;
    private final RateLimitProperties properties;
    private final RedisScript<List> tokenBucket;
    private final RedisScript<List> slidingLog;
    private final RedisScript<List> slidingCounter;

    public RedisRateLimiter(ReactiveStringRedisTemplate redis, RateLimitProperties properties) {
        this.redis = redis;
        this.properties = properties;
        this.tokenBucket = script("redis/token_bucket.lua");
        this.slidingLog = script("redis/sliding_window_log.lua");
        this.slidingCounter = script("redis/sliding_window_counter.lua");
    }

    @SuppressWarnings("unchecked")
    private static RedisScript<List> script(String classpathLocation) {
        DefaultRedisScript<List> script = new DefaultRedisScript<>();
        script.setScriptSource(new ResourceScriptSource(new ClassPathResource(classpathLocation)));
        script.setResultType(List.class);
        return (RedisScript<List>) script;
    }

    public Mono<RateLimitDecision> check(String dimension, String identity, Policy policy) {
        String key = properties.getKeyPrefix() + ":{" + dimension + ":" + sha256(identity) + "}";
        return switch (properties.getAlgorithm()) {
            case TOKEN_BUCKET -> checkTokenBucket(key, policy);
            case SLIDING_WINDOW_LOG -> checkSlidingLog(key, policy);
            case SLIDING_WINDOW_COUNTER -> checkSlidingCounter(key, policy);
        };
    }

    private Mono<RateLimitDecision> checkTokenBucket(String key, Policy policy) {
        double refill = policy.getRefillPerSecond();
        long ttl = Math.max(1_000, (long) Math.ceil(policy.getLimit() / refill * 2_000));
        return execute(tokenBucket, List.of(key), Long.toString(policy.getLimit()),
                Double.toString(refill), "1", Long.toString(ttl), policy.getLimit());
