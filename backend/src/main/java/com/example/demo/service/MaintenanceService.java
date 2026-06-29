package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.AssetStatus;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;

import jakarta.transaction.*;

@Service
public class MaintenanceService
{
    @Autowired
    MaintenanceScheduleRepository scheduleRepository;
    MaintenanceLogRepository logRepository;
    IndustrialAssetRepository assetRepository;


    public List<MaintenanceSchedule> getUpcomingSchedules()
    {
        return scheduleRepository.findByStatus(ScheduleStatus.PENDING);
    }

    public List<MaintenanceLog> getAllLogs()
    {
        return logRepository.findAll();
    }

    @Transactional
    public MaintenanceSchedule scheduleMaintenance(ScheduleRequestDto dto)
    {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
            .orElseThrow( ()-> new ResourceNotFoundException("Asset not found"));

        MaintenanceSchedule schedule = MaintenanceSchedule.builder()
            .asset(asset)
            .plannedDate(dto.getPlannedDate())
            .maintenanceType(dto.getMaintenanceType())
            .priority(dto.getPriority())
            .status(ScheduleStatus.PENDING)
            .build()

        if (dto.getPriority().name().equals("HIGH") || dto.getPriority().name().equals("CRITICAL"))
        {
            asset.setCurrentStatus(AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(schedule);
        }
    }

    

    @Transactional
    public void deleteLog(Long id)
    {
        logRepository.deleteById(id);
    }
}