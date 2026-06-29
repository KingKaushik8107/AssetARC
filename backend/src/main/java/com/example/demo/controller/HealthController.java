package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.ConditionMonitoringService;

@RestController
@RequestMapping("/api/health")
public class HealthController
{
    @Autowired
    ConditionMonitoringService monitoringService;

    @PostMapping("/record")
    // @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<Void> recordHealthMetric(@RequestBody Heal)
}
