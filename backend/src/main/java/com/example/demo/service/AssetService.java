package com.example.demo.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.AssetStatus;
import com.example.demo.enums.ScheduleStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class AssetService
{
    private final IndustrialAssetRepository repository;
    private final MaintenanceScheduleRepository scheduleRepository;

    public DashboardStatsDto getDashboardStats()
    {
        List<IndustrialAsset> all = repository.findAll();

        long total = all.size();
        long maintenance = all.stream()
                .filter(a -> a.getCurrentStatus() == AssetStatus.UNDER_MAINTENANCE).count();

        double avgHealth = all.stream()
            .mapToInt(a -> a.getCurrentHealth() != null ? a.getCurrentHealth() : 100)
                .average().orElse(0.0);
                
        BigDecimal totalValue = all.stream().map(IndustrialAsset::getPurchasePrice)
            .reduce(BigDecimal.ZERO,BigDecimal::add);

        Map<String, Long> distribution = all.stream()
                .collect(Collectors.groupingBy(a -> a.getCurrentStatus().name(), Collectors.counting()));

        return DashboardStatsDto.builder()
                .totalAssets(total)
                .activeMaintenanceCount(maintenance)
                .averageHealthScore(avgHealth)
                .totalFleetValue(totalValue)
                .statusDistribution(distribution)
                .build();
    }

    public Page<IndustrialAsset> getAllAssets(Pageable pageable) 
    {
        return repository.findAll(pageable);
    }

    public IndustrialAsset getAssetById(Long id) 
    {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));
    }

    public IndustrialAsset createAsset(AssetRequestDto dto)
    {
        IndustrialAsset asset = IndustrialAsset.builder()
                .assetTag(dto.getAssetTag())
                .name(dto.getName())
                .category(dto.getCategory())
                .installDate(dto.getInstallDate())
                .purchasePrice(dto.getPurchasePrice())
                .expectedLifespanYears(dto.getExpectedLifespanYears())
                .currentStatus(AssetStatus.ACTIVE)
                .currentHealth(100)
                .build();
        return repository.save(asset);
    }

    @Transactional
    public IndustrialAsset updateAsset(Long id, AssetRequestDto dto)
    {
        IndustrialAsset asset = getAssetById(id);
        asset.setName(dto.getName());
        asset.setCategory(dto.getCategory());
        asset.setInstallDate(dto.getInstallDate());
        asset.setPurchasePrice(dto.getPurchasePrice());
        asset.setExpectedLifespanYears(dto.getExpectedLifespanYears());
        return repository.save(asset);
    }

    @Transactional
    public void decommissionAsset(Long id) 
    {
        IndustrialAsset asset = getAssetById(id);
        asset.setCurrentStatus(AssetStatus.DECOMMISSIONED);
        repository.save(asset);
        List<MaintenanceSchedule> pendingSchedules = scheduleRepository.findByAssetIdAndStatus(id,ScheduleStatus.PENDING);
        pendingSchedules.forEach(s -> s.setStatus(ScheduleStatus.CANCELLED));
        scheduleRepository.saveAll(pendingSchedules);
    }
}