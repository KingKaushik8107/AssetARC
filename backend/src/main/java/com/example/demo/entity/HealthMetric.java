package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "health_metrics")
public class HealthMetric
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id",nullable = false)
    private IndustrialAsset asset;

    @Column(name = "recorded_at",nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "health_score",nullable = false)
    private int healthScore;

    @Column(name = "vibration_level")
    private Double vibrationLevel;

    @Column(name = "temperature_celsius")
    private Double temperatureCelsius;
}