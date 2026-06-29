package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ConditionMonitoringService;

@RestController
@RequestMapping("/api/health")
public class HealthController
{
    @Autowired
    ConditionMonitoringService monitoringService;

    @PostMapping("/record")
    // @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN')")
    
}
