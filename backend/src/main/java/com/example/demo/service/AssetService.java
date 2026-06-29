package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.exception.ResourceNotFoundException;
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

    }

    public IndustrialAsset getAssetById(Long id)
    {
        return(repo.findById(id))
            .orElseThrow(()-> new ResourceNotFoundException("Asset not found"));
    }

    public void createAsset(AssetRequestDto dto)
    {
        IndustrialAsset asset = IndustrialAsset.builder()
            .assetTag(dto.getAssetTag())
            .name(dto.getName())
            .category(dto.getCategory())
            .installDate(dto.getInstallDate())
            .purchasePrice(dto.getPurchaseprice())
            .expectedLifespanYears(dto.getExpectedLifespanYears())
            .currentStatus(As)
    }
}
