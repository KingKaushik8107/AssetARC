package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;

@Service
public class AssetService
{

    public ResponseEntity<DashboardStatsDto> getDashboardStats()
    {

        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDashboardStats'");
    }

    public Page<IndustrialAsset> getAllAssets(Pageable pageable)
    {

        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllAssets'");
    }
    
}
