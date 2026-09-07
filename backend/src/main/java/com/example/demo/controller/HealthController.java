package com.example.demo.controller;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    private final ConditionMonitoringService service;

    @PostMapping("/record")
    @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN', 'SYSTEM_ADMIN')")
    public ResponseEntity<Void> recordHealth(@RequestBody HealthMetricDto dto) {
        service.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/record")
    @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN', 'SYSTEM_ADMIN')")
    public ResponseEntity<Void> updateHealth(@RequestBody HealthMetricDto dto) {
        service.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}
