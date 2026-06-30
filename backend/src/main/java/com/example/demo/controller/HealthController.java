package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;

@RestController
@RequestMapping("/api/health")
public class HealthController
{
    @Autowired
    ConditionMonitoringService monitoringService;

    @PostMapping("/record")
    @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<Void> recordHealthMetric(@RequestBody HealthMetricDto dto)
    {
        monitoringService.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}
