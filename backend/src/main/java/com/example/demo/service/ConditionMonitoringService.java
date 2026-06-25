package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.repository.HealthMetricRepository;

@Service
public class ConditionMonitoringService
{
    @Autowired
    HealthMetricRepository repository;

    public void recordHealthMetric(HealthMetricDto dto)
    {
        
    }
}
