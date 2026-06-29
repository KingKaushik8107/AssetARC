package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.service.MaintenanceService;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController
{
    @Autowired
    MaintenanceService service;

    @GetMapping("/schedules")
    public ResponseEntity<List<MaintenanceSchedule>> getSchedules()
    {
        ResponseEntity.ok(service.getUpcomingSchedules());

    }
}
