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

