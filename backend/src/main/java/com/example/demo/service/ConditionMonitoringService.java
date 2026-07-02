package com.example.demo.service;

import com.example.demo.entity.IndustrialAsset;
import com.example.demo.dto.HealthMetricDto;
import com.example.demo.entity.HealthMetric;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.HealthMetricRepository;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConditionMonitoringService {
    private final HealthMetricRepository repository;
    private final IndustrialAssetRepository assetRepository;
    private final MaintenanceScheduleRepository scheduleRepository;

    @Transactional
    public void recordHealthMetric(HealthMetricDto dto) {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        HealthMetric metric = HealthMetric.builder()
                .asset(asset)
                .recordedAt(LocalDateTime.now())
                .healthScore(dto.getHealthScore())
                .vibrationLevel(dto.getVibrationLevel())
                .temperatureCelsius(dto.getTemperatureCelsius())
                .build();
        repository.save(metric);

        // Auto-trigger repair if health is critical
        if (dto.getHealthScore() < 40) {
            MaintenanceSchedule emergencyRepair = MaintenanceSchedule.builder()
                    .asset(asset)
                    .plannedDate(LocalDate.now())
                    .maintenanceType(MaintenanceType.REPAIR)
                    .priority(Priority.CRITICAL)
                    .status(ScheduleStatus.PENDING)
                    .build();
            scheduleRepository.save(emergencyRepair);

            asset.setCurrentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }
    }
}
