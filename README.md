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

## Frontend control-plane preview

The React/Vite dashboard lives in `frontend/`. Run it separately from the gateway:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the UI on port `5173`. Set `GATEWAY_TARGET` if the Spring Gateway is not at `http://localhost:8080`; the dev server proxies `/api` and `/actuator` requests. The current dashboard is an interactive UI preview: sample traffic/Redis metrics are clearly labeled, and policy edits and test requests are held in browser state rather than persisted to the gateway. Validate it with `npm test` and build static assets with `npm run build`.

## Identity and policies

The global filter applies enabled policies independently, in this order:

1. **User:** authenticated `Principal.getName()`, falling back to `X-User-Id`.
2. **IP:** the socket peer address (`remoteAddress`). It deliberately does **not** trust arbitrary `X-Forwarded-For`; configure your ingress/proxy to establish a trusted client address before relying on IP limits.
3. **API key:** `X-API-Key`.

No user/API-key identity means that particular dimension is skipped; IP remains independently enforced when enabled. Ensure user identity headers are stripped/replaced by trusted authentication middleware. Every enabled dimension must pass, so a user can be limited by their user, IP, or API-key bucket. Rejected requests receive `429`, `RateLimit-Limit`, `RateLimit-Remaining`, and `Retry-After` headers.

## Algorithms

Select with `RATE_LIMIT_ALGORITHM`:

- `TOKEN_BUCKET`: burst capacity is `limit`; `refill-per-second` controls sustained rate. Redis `TIME` supplies the clock, and the Lua script atomically refills then consumes one token.
- `SLIDING_WINDOW_LOG`: exact rolling count using a sorted set and unique request members. It uses more Redis memory/operations proportional to requests in the active window.
- `SLIDING_WINDOW_COUNTER`: weighted previous/current fixed buckets, an efficient approximation using one Redis hash per identity. It has lower memory overhead, with some boundary approximation.

For the two sliding-window strategies, `limit` is the maximum request count in `window`; `refill-per-second` is not used. TTLs clean up inactive identities. Redis `TIME` is used inside every Lua script instead of gateway-node clocks, avoiding cross-instance clock skew. Keep Redis time synchronized as well; a large wall-clock correction on Redis itself may affect time-based windows.

All keys touched by a script are within a single Redis Cluster hash slot. Redis is the shared source of truth; do not add per-instance local counters if strict global limits are required.

## Redis outage policy (important)

`RATE_LIMIT_FAILURE_MODE=OPEN` (default) lets traffic through if Redis errors. This favors API availability, but limits are temporarily unenforced and an attacker can exploit an outage. `CLOSED` returns `503 Service Unavailable` when Redis cannot make a decision. This protects downstream capacity but makes Redis availability part of API availability. Choose explicitly based on the protected resource and threat model; alert on Redis errors either way. A `429` is only returned for a successful Redis decision that exceeds policy.

## Configuration example

```yaml
drt:
  rate-limit:
    algorithm: TOKEN_BUCKET
    failure-mode: CLOSED
    user: { enabled: true, limit: 100, refill-per-second: 10, window: 1m }
    ip: { enabled: true, limit: 300, refill-per-second: 30, window: 1m }
    api-key: { enabled: true, limit: 1000, refill-per-second: 100, window: 1m }
```

The custom `DistributedRateLimitFilter` is a `GlobalFilter`, so it applies to all matched gateway routes. Redis health is exposed through Spring Boot Actuator at `/actuator/health`.
