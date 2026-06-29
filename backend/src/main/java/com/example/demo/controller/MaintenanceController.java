package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.MaintenanceService;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController
{
    @Autowired
    MaintenanceService service;

    @GetMapping("/schedules")
    
}
