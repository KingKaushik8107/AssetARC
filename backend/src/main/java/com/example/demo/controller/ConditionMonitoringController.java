package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.HealthMetricDto;

@RestController
@RequestMapping("/api/monitoring")
public class ConditionMonitoringController
{
    @PostMapping("/metrics")
    public ResponseEntity<> createMetrics(@RequestBody HealthMetricDto healthMetricDto)
    {
        
    }
}
