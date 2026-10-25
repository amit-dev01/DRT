package dev.drt.gateway.filter;

import dev.drt.gateway.config.RateLimitProperties;
import dev.drt.gateway.config.RateLimitProperties.Policy;
import dev.drt.gateway.ratelimit.RateLimitDecision;
import dev.drt.gateway.ratelimit.RedisRateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DistributedRateLimitFilter implements GlobalFilter, Ordered {
    private static final Logger log = LoggerFactory.getLogger(DistributedRateLimitFilter.class);
    private final RedisRateLimiter limiter;
    private final RateLimitProperties properties;

    public DistributedRateLimitFilter(RedisRateLimiter limiter, RateLimitProperties properties) {
        this.limiter = limiter;
        this.properties = properties;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (!properties.isEnabled()) return chain.filter(exchange);
        return identities(exchange).flatMap(identities -> checkFirstRejected(identities)
                .onErrorResume(error -> {
                    if (properties.getFailureMode() == RateLimitProperties.FailureMode.OPEN) {
                        log.warn("Redis rate limiter unavailable; allowing request because failure-mode=OPEN: {}", error.toString());
                        return Mono.just(Optional.empty());
                    }
                    log.error("Redis rate limiter unavailable; rejecting request because failure-mode=CLOSED", error);
                    return Mono.error(new RateLimiterUnavailableException(error));
                })
                .flatMap(result -> result.map(decision -> reject(exchange, decision))
                        .orElseGet(() -> chain.filter(exchange)))
                .onErrorResume(RateLimiterUnavailableException.class, ignored -> unavailable(exchange)));
    }

    private Mono<List<Identity>> identities(ServerWebExchange exchange) {
        String explicitUser = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-Key");
        InetSocketAddress remote = exchange.getRequest().getRemoteAddress();
        String ip = remote == null || remote.getAddress() == null ? null : remote.getAddress().getHostAddress();
        return exchange.getPrincipal()
                .map(Principal::getName)
                .defaultIfEmpty("")
                .map(principalName -> {
                    List<Identity> identities = new ArrayList<>(3);
                    Policy userPolicy = properties.getUser();
                    String user = nonBlank(principalName) ? principalName : explicitUser;
                    if (userPolicy.isEnabled() && nonBlank(user)) identities.add(new Identity("user", user, userPolicy));
                    Policy ipPolicy = properties.getIp();
                    if (ipPolicy.isEnabled() && nonBlank(ip)) identities.add(new Identity("ip", ip, ipPolicy));
                    Policy apiPolicy = properties.getApiKey();
                    if (apiPolicy.isEnabled() && nonBlank(apiKey)) identities.add(new Identity("api-key", apiKey, apiPolicy));
                    return identities;
                });
    }

    private Mono<Optional<RateLimitDecision>> checkFirstRejected(List<Identity> identities) {
