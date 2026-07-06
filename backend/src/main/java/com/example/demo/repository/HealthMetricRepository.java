package com.example.demo.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.HealthMetric;

public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long>
{
    List<HealthMetric> findByAssetIdOrderByRecordedAtDesc(Long assetId);
    Optional<HealthMetric> findTopByAssetIdOrderByRecordedAtDesc(Long assetId);
}
