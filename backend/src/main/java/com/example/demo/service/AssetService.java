package com.example.demo.service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.enums.AssetStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;

import jakarta.transaction.Transactional;

@Service
public class AssetService
{
    @Autowired
    IndustrialAssetRepository repo;

    public DashboardStatsDto getDashboardStats()
    {
        var asset = repo.findAll();
        long totalAsset = asset.size();
        long maintenanceCount = asset.stream()
            .filter(a -> a.getCurrentStatus() == AssetStatus.UNDER_MAINTENANCE).count();

        double avgHealth = asset.stream()
            .mapToDouble(a -> a.getCurrentHealth())
            .average()
            .orElse(100);
        
        BigDecimal totalFleetValue = asset.stream()
            .map(IndustrialAsset::getPurchasePrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        Map<String,Long> statusDistribution = asset.stream()
            .collect(Collectors.groupingBy(
                a -> a.getCurrentStatus().name(),Collectors.counting()
            ));
                
        return DashboardStatsDto.builder()
            .totalAssets(totalAsset)
            .activeMaintenanceCount(maintenanceCount)
            .averageHealthScore(avgHealth)
            .totalFleetValue(totalFleetValue)
            .statusDistribution(statusDistribution)
            .build();
    }

    public Page<IndustrialAsset> getAllAssets(Pageable pageable)
    {
        return(repo.findAll(pageable));
    }

    public IndustrialAsset getAssetById(Long id)
    {
        return(repo.findById(id))
            .orElseThrow(()-> new ResourceNotFoundException("Asset not found"));
    }

    public IndustrialAsset createAsset(AssetRequestDto dto)
    {
        IndustrialAsset asset = IndustrialAsset.builder()
            .assetTag(dto.getAssetTag())
            .name(dto.getName())
            .category(dto.getCategory())
            .installDate(dto.getInstallDate())
            .purchasePrice(dto.getPurchaseprice())
            .expectedLifespanYears(dto.getExpectedLifespanYears())
            .currentStatus(AssetStatus.ACTIVE)
            .currentHealth(100)
            .build();

        return repo.save(asset);
    }

    @Transactional
    public IndustrialAsset updateAsset(Long id, AssetRequestDto dto)
    {
        IndustrialAsset asset = repo.findById(id)
            .orElseThrow( ()-> new ResourceNotFoundException("Asset not found"));
        
        // asset.setAssetTag(dto.getAssetTag());
        asset.setName(dto.getName());
        asset.setCategory(dto.getCategory());
        asset.setInstallDate(dto.getInstallDate());
        asset.setPurchasePrice(dto.getPurchaseprice());
        asset.setExpectedLifespanYears(dto.getExpectedLifespanYears());

        return repo.save(asset);
    }

    @Transactional
    public void decommissionAsset(Long id)
    {
        IndustrialAsset asset = repo.findById(id)
            .orElseThrow( ()-> new ResourceNotFoundException("Asset not found"));
           
        asset.setCurrentStatus(AssetStatus.DECOMMISSIONED);
        // repo.save(asset);
    }
}
