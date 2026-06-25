package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;

@RestController
@RequestMapping("/api/monitoring")
public class ConditionMonitoringController
{
    @Autowired
    ConditionMonitoringService service;

    @PostMapping("/metrics")
    public ResponseEntity<Void> createMetrics(@RequestBody HealthMetricDto dto)
    {
        service.recordHealthMetric(dto);
    }
}
