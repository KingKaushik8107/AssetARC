package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.*;

@Data
@Builder
public class DashboardStatsDto
{
    private Long totalAssets;
    private Long activeMaintenanceCount;
    private Double averageHealthScore;
    private BigDecimal totalFleetValue;
    private Map<String, Long> statusDistribution;
}
