package dev.drt.gateway.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "drt.rate-limit")
public class RateLimitProperties {
    private boolean enabled = true;
    private Algorithm algorithm = Algorithm.TOKEN_BUCKET;
    private FailureMode failureMode = FailureMode.OPEN;
    private String keyPrefix = "drt:rl:v1";
    @Valid private Policy user = new Policy(true, 100, 10.0, Duration.ofMinutes(1));
    @Valid private Policy ip = new Policy(true, 300, 30.0, Duration.ofMinutes(1));
    @Valid private Policy apiKey = new Policy(true, 1000, 100.0, Duration.ofMinutes(1));

    public enum Algorithm { TOKEN_BUCKET, SLIDING_WINDOW_LOG, SLIDING_WINDOW_COUNTER }
    public enum FailureMode { OPEN, CLOSED }

    public static class Policy {
        private boolean enabled;
        @Min(1) private long limit;
        @DecimalMin(value = "0.000001") private double refillPerSecond;
        private Duration window;

        public Policy() { }
        public Policy(boolean enabled, long limit, double refillPerSecond, Duration window) {
            this.enabled = enabled;
            this.limit = limit;
            this.refillPerSecond = refillPerSecond;
            this.window = window;
        }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public long getLimit() { return limit; }
        public void setLimit(long limit) { this.limit = limit; }
        public double getRefillPerSecond() { return refillPerSecond; }
        public void setRefillPerSecond(double refillPerSecond) { this.refillPerSecond = refillPerSecond; }
        public Duration getWindow() { return window; }
        public void setWindow(Duration window) { this.window = window; }
    }

