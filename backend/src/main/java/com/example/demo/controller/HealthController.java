package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;

import lombok.*;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController
{
    private final ConditionMonitoringService service;

    @PostMapping("/record")
    @PreAuthorize("hasRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<Void> recordHealth(@RequestBody HealthMetricDto dto)
    {
        service.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}