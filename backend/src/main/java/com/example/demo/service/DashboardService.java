package com.example.demo.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.IndustrialAsset.AssetStatus;
import com.example.demo.repository.IndustrialAssetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService
{
    private final IndustrialAssetRepository assetRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getGlobalStats()
    {
        long totalAssets = assetRepository.count();
        long activeMaintenance = assetRepository.countByCurrentStatus(AssetStatus.UNDER_MAINTENANCE);

        List<IndustrialAsset> allAssets = assetRepository.findAll();
        BigDecimal totalValue = allAssets.stream()
                .map(IndustrialAsset::getPurchasePrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> statusDistribution = allAssets.stream()
                .collect(Collectors.groupingBy(
                        asset -> asset.getCurrentStatus().name(),
                        Collectors.counting()
                ));

        double avgHealth = 85.5;

        return DashboardStatsDto.builder()
                .totalAssets(totalAssets)
                .activeMaintenanceCount(activeMaintenance)
                .averageHealthScore(avgHealth)
                .totalFleetValue(totalValue)
                .statusDistribution(statusDistribution)
                .build();
    }
}
