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
