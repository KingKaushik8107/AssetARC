package com.example.demo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricDto
{
    private Long assetId;
    private Integer healthScore;
    private Double vibrationLevel;
    private Double temperatureCelsius;    
}