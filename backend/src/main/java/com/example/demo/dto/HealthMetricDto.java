package com.example.demo.dto;

@Data
@Builder
@NoArgsConstructor
public class HealthMetricDto
{
    private Long assetId;
    private Integer healthScore;
    private Double vibrationLevel;
    private Double temperatureCelsius;    
}
