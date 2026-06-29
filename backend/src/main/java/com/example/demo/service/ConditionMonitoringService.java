package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.entity.HealthMetric;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.AssetStatus;
import com.example.demo.enums.MaintenanceType;
import com.example.demo.enums.Priority;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.HealthMetricRepository;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;

@Service
public class ConditionMonitoringService
{
    @Autowired
    HealthMetricRepository metricRepository;

    @Autowired
    IndustrialAssetRepository assetRepository;

    @Autowired
    MaintenanceScheduleRepository scheduleRepository;


    @Transactional
    public void recordHealthMetric(HealthMetricDto dto)
    {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
            .orElseThrow( ()-> new ResourceNotFoundException("Asset not found"));
        
        HealthMetric metric = HealthMetric.builder()
            .asset(asset)
            .recordedAt(LocalDateTime.now())
            .healthScore(dto.getHealthScore())
            .vibrationLevel(dto.getVibrationLevel())
            .temperatureCelsius(dto.getTemperatureCelsius())
            .build();
        
        metricRepository.save(metric);

        if (dto.getHealthScore() < 40)
        {
            MaintenanceSchedule schedule = MaintenanceSchedule.builder()
                .asset(asset)
                .plannedDate(LocalDate.now())
                .maintenanceType(MaintenanceType.REPAIR)
                .priority(Priority.CRITICAL)
                .status(ScheduleStatus.PENDING)
                .build();
            
            scheduleRepository.save(schedule);

            asset.setCurrentStatus(AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }
    }
}
