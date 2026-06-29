package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.service.AssetService;

@RestController
@RequestMapping("/api/assets")
public class AssetController
{
    @Autowired
    AssetService service;

    @GetMapping("/register")
    public ResponseEntity<DashboardStatsDto> getStats()
    {
        return service.getDashboardStats();
    }

    @GetMapping("")
}
