package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;

import jakarta.transaction.*;

@Service
public class MaintenanceService
{
    @Autowired
    MaintenanceScheduleRepository scheduleRepository;
    MaintenanceLogRepository logRepository;

    public List<MaintenanceSchedule> getUpcomingSchedules()
    {
        return scheduleRepository.findByStatus(ScheduleStatus.PENDING);
    }

    public List<MaintenanceLog> getAllLogs()
    {
        return logRepository.findAll();
    }

    // public MaintenanceSchedule scheduleMaintenance(ScheduleRequestDto dto)
    // {

    // }

    @Transactional
    public void deleteLog(Long id)
    {
        logRepository.deleteById(id);
    }
}