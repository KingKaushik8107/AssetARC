package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.AssetStatus;
import com.example.demo.enums.Role;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import com.example.demo.repository.SystemUserRepository;

import jakarta.transaction.*;

@Service
public class MaintenanceService
{
    @Autowired
    MaintenanceScheduleRepository scheduleRepository;
    MaintenanceLogRepository logRepository;
    IndustrialAssetRepository assetRepository;
    SystemUserRepository userRepository;


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
            .build();

        if (dto.getPriority().name().equals("HIGH") 
            || dto.getPriority().name().equals("CRITICAL"))
        {
            asset.setCurrentStatus(AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }
        return scheduleRepository.save(schedule);
    }

    @Transactional(rollbackFor = Exception.class)
    public MaintenanceLog completeMaintenanceTask(LogRequestDto dto)
    {
        MaintenanceSchedule schedule = scheduleRepository.findById(dto.getScheduled())
            .orElseThrow( ()-> new ResourceNotFoundException("Schedule not found"));\
        
        if (schedule.getStatus() != ScheduleStatus.PENDING)
        {
            throw new BusinessValidationException("Task is already processed or cancelled");
        }

        SystemUser technician = userRepository.findById(dto.getTechnicianId())
            .orElseThrow( ()-> new ResourceNotFoundException("Technician not found"));
        
        if (technician.getRole() != Role.MAINTENANCE_TECHNICIAN)
        {
            throw new BusinessValidationException("Selected user is not a maintenance technician");
        }

        MaintenanceLog log = MaintenanceLog.builder()
            .asset(schedule.)

    }


    @Transactional
    public void deleteLog(Long id)
    {
        logRepository.deleteById(id);
    }
}