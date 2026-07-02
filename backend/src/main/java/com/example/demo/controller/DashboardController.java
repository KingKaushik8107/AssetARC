package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.service.DashboardService;

import lombok.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController
{
    private final DashboardService service;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN', 'MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<DashboardStatsDto> getStats()
    {
        return ResponseEntity.ok(service.getGlobalStats());
    }
}