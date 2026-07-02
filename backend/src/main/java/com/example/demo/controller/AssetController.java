package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.service.AssetService;

import lombok.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController
{
    private final AssetService service;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats()
    {
        return ResponseEntity.ok(service.getDashboardStats());
    }

    @GetMapping
    public ResponseEntity<Page<IndustrialAsset>> getAllAssets(Pageable pageable)
    {
        return ResponseEntity.ok(service.getAllAssets(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndustrialAsset> getAssetById(@PathVariable Long id)
    {
        return ResponseEntity.ok(service.getAssetById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> createAsset(@RequestBody AssetRequestDto dto)
    {
        service.createAsset(dto);
        return ResponseEntity.status(201).body("Asset created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> updateAsset(@PathVariable Long id, @RequestBody AssetRequestDto dto)
    {
        service.updateAsset(id, dto);
        return ResponseEntity.ok("Asset updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> decommissionAsset(@PathVariable Long id)
    {
        service.decommissionAsset(id);
        return ResponseEntity.ok("Asset deleted successfully.");
    }
}
