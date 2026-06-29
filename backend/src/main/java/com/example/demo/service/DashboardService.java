package com.example.demo.service;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.repository.IndustrialAssetRepository;

@Service
public class DashboardService
{
    @Autowired
    IndustrialAssetRepository assetRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto gDashboardStatsDto
}
