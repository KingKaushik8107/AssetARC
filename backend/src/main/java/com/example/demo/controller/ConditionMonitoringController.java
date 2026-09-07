package com.example.demo.controller;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class ConditionMonitoringController {
    private final ConditionMonitoringService service;

    @PostMapping("/metrics")
    public ResponseEntity<Void> recordMetric(@RequestBody HealthMetricDto dto) {
        service.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/metrics")
    public ResponseEntity<Void> updateMetric(@RequestBody HealthMetricDto dto) {
        service.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}
