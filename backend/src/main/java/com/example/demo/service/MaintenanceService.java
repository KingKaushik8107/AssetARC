package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;

@Service
public class MaintenanceService
{
    @Autowired
    MaintenanceScheduleRepository scheduleRepository;
    MaintenanceLogRepository maintenanceLogRepository;

    public List<MaintenanceSchedule> getUpcomingSchedules()
    {
        return 
    }
}