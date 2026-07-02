package com.example.demo.service;

import com.example.demo.entity.IndustrialAsset;
import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {
    private final MaintenanceScheduleRepository scheduleRepository;
    private final MaintenanceLogRepository logRepository;
    private final IndustrialAssetRepository assetRepository;
    private final SystemUserRepository userRepository;

    public List<MaintenanceSchedule> getUpcomingSchedules() {
        return scheduleRepository.findByStatus(MaintenanceSchedule.ScheduleStatus.PENDING);
    }

    public List<MaintenanceLog> getAllLogs() {
        return logRepository.findAll();
    }

    @Transactional
    public MaintenanceSchedule scheduleMaintenance(ScheduleRequestDto dto) {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        MaintenanceSchedule schedule = MaintenanceSchedule.builder()
                .asset(asset)
                .plannedDate(dto.getPlannedDate())
                .maintenanceType(dto.getMaintenanceType())
                .priority(dto.getPriority())
                .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                .build();

        // If high priority, move asset to under maintenance immediately
        if (dto.getPriority() == MaintenanceSchedule.Priority.HIGH || dto.getPriority() == MaintenanceSchedule.Priority.CRITICAL) {
            asset.setCurrentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }

        return scheduleRepository.save(schedule);
    }

    @Transactional(rollbackFor = Exception.class)
    public MaintenanceLog completeMaintenanceTask(LogRequestDto dto) {
        MaintenanceSchedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        if (schedule.getStatus() != MaintenanceSchedule.ScheduleStatus.PENDING) {
            throw new BusinessValidationException("Task is already processed or cancelled");
        }

        SystemUser technician = userRepository.findById(dto.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        // 1. Create Log
        MaintenanceLog log = MaintenanceLog.builder()
                .asset(schedule.getAsset())
                .schedule(schedule)
                .completionDate(LocalDateTime.now())
                .technician(technician)
                .workDescription(dto.getWorkDescription())
                .costIncurred(dto.getCostIncurred())
                .build();
        logRepository.save(log);

        // 2. Update Schedule
        schedule.setStatus(MaintenanceSchedule.ScheduleStatus.COMPLETED);
        scheduleRepository.save(schedule);

        // 3. Update Asset Status back to ACTIVE and Reset Health
        IndustrialAsset asset = schedule.getAsset();
        asset.setCurrentStatus(IndustrialAsset.AssetStatus.ACTIVE);
        asset.setCurrentHealth(100);
        assetRepository.save(asset);

        return log;
    }
    @Transactional
    public void deleteLog(Long id) {
        logRepository.deleteById(id);
    }
}
