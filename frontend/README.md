# DRT Control Plane UI

A responsive React/Vite control-plane preview for the Spring Cloud Gateway rate limiter.

## Development

```bash
npm install
npm run dev
```

The Vite server binds to `0.0.0.0:5173`. It proxies `/api` and `/actuator` to `GATEWAY_TARGET`, defaulting to `http://localhost:8080`.

## Validation

```bash
npm test
npm run build
```

## Data boundary

The current UI uses clearly labeled sample metrics, request events, and Redis-node health. Policy changes and generated test requests exist only in browser state. They do not configure the gateway or persist to Redis. The Spring service does not yet expose an administrative policy or metrics API; the proxy is ready for those endpoints when they are added.
