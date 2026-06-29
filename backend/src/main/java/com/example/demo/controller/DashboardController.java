package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController
{
    @Autowired
    DashboardService service;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER','OPERATIONS_SUPERVISOR','')")
}
