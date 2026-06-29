package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
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

    @GetMapping
    public ResponseEntity<Page<IndustrialAsset>>getAllAssets(Pageable pageable)
    {
        return ResponseEntity.ok(service.getAllAssets(pageable));
    }

    @GetMapping("/{id}")
    public 
}
