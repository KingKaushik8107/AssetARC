package com.example.demo.service;

import java.math.BigDecimal;
import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.enums.AssetStatus;
import com.example.demo.repository.IndustrialAssetRepository;

@Service
public class DashboardService
{
    @Autowired
    IndustrialAssetRepository assetRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto gDashboardStatsDto()
    {
        long totalAssets = assetRepository.count();
        long activeMaintenance = assetRepository.countByCurrentStatus(AssetStatus.UNDER_MAINTENANCE);

        List<IndustrialAsset> assets = assetRepository.findAll();

        BigDecimal totalValue = assets.stream()
            .map(IndustrialAsset::getPurchasePrice)
            .filter(price -> price != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
            Map<String, Long> status
    }
}
