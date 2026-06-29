package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.repository.IndustrialAssetRepository;

@Service
public class AssetService
{
    @Autowired
    IndustrialAssetRepository repo;

    public ResponseEntity<DashboardStatsDto> getDashboardStats()
    {

        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDashboardStats'");
    }

    public Page<IndustrialAsset> getAllAssets(Pageable pageable)
    {
        return(repo.findAll(pageable));


        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'getAllAssets'");
    }

    public ResponseEntity<IndustrialAsset> getAssetById(Long id)
    {
        return(repo.findById(id));

        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'getAssetById'");
    }
    
}
