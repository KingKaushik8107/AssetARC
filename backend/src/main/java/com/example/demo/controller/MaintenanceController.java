package com.example.demo.controller;

import java.util.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.service.MaintenanceService;

import lombok.*;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController
{
    private final MaintenanceService service;

    @GetMapping("/schedules")
    public ResponseEntity<List<MaintenanceSchedule>> getSchedules()
    {
        return ResponseEntity.ok(service.getUpcomingSchedules());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<MaintenanceLog>> getLogs()
    {
        return ResponseEntity.ok(service.getAllLogs());
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<MaintenanceSchedule> scheduleTask(@RequestBody ScheduleRequestDto dto)
    {
        return ResponseEntity.ok(service.scheduleMaintenance(dto));
    }

    @PostMapping("/complete")
    @PreAuthorize("hasRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<MaintenanceLog> completeTask(@RequestBody LogRequestDto dto)
    {
        return ResponseEntity.ok(service.completeMaintenanceTask(dto));
    }
    
    @DeleteMapping("/logs/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> deleteLog(@PathVariable Long id)
    {
        service.deleteLog(id);
        return ResponseEntity.ok("MaintenanceLog deleted successfully.");
    }
}
