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
