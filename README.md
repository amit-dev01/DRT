# Distributed Rate Limiter / Spring Cloud Gateway

A Spring Boot 3 / Spring Cloud Gateway WebFlux application with three Redis-backed rate-limiting algorithms. Each decision is made by a single Redis Lua script, so checking and consuming capacity is atomic across gateway instances. The keys contain a SHA-256 digest of the identity (not the raw user ID or API key).

## Run

Requires Java 17+, Maven 3.9+, and Docker (or an external Redis).

```bash
docker compose up -d redis
mvn spring-boot:run
```

Gateway listens on port `8080` and proxies `/api/**` to `http://localhost:8081` by default. Set `UPSTREAM_URI` for your API. For example:

```bash
REDIS_HOST=redis.internal \
UPSTREAM_URI=https://api.example.com \
RATE_LIMIT_ALGORITHM=SLIDING_WINDOW_LOG \
RATE_LIMIT_FAILURE_MODE=CLOSED \
mvn spring-boot:run
```

The Redis URL/credentials and all policies can be set with environment variables listed in `src/main/resources/application.yml`.

## Identity and policies

The global filter applies enabled policies independently, in this order:

1. **User:** authenticated `Principal.getName()`, falling back to `X-User-Id`.
2. **IP:** the socket peer address (`remoteAddress`). It deliberately does **not** trust arbitrary `X-Forwarded-For`; configure your ingress/proxy to establish a trusted client address before relying on IP limits.
3. **API key:** `X-API-Key`.
