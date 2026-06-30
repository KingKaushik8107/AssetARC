package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.service.MaintenanceService;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController
{
    private final MaintenanceService service;

    @Autowired
    public MaintenanceController(MaintenanceService service)
    {
        this.service = service;
    }
    
    @GetMapping("/schedules")
    public ResponseEntity<List<MaintenanceSchedule>> getSchedules()
    {
        return ResponseEntity.ok(service.getUpcomingSchedules());

    }

    @GetMapping("/logs")
    public ResponseEntity<List<MaintenanceLog>>getLogs()
    {
        return ResponseEntity.ok(service.getAllLogs());
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER','SYSTEM_ADMIN')")
    public ResponseEntity<MaintenanceSchedule> scheduleMaintenance(@RequestBody ScheduleRequestDto dto)
    {
        return ResponseEntity.ok(service.scheduleMaintenance(dto));
    }
    
    @PostMapping("/complete")
    @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<MaintenanceLog> completeMaintenance(@RequestBody LogRequestDto dto)
    {
        return ResponseEntity.ok(service.completeMaintenanceTask(dto));
    }
    
    @DeleteMapping("/logs/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER','SYSTEM_ADMIN')")
    public ResponseEntity<String> deleteLog(@PathVariable Long id)
    {
        service.deleteLog(id);
        return ResponseEntity.ok("MaintenanceLog deleted successfully");
    }
}