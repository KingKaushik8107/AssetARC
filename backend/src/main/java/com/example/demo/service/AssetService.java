package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.enums.AssetStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;

import jakarta.transaction.Transactional;
import lombok.val;

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
        
        asset.setName(dto.getName());
        asset.setCategory(dto.getCategory());
        asset.setInstallDate(dto.getInstallDate());
        asset.setPurchasePrice(dto.getPurchaseprice());
        asset.setExpectedLifespanYears(dto.getExpectedLifespanYears());

        return repo.save(asset);
    }

    @Transactional
    public void decommisionAsset(Long id)
    {
        IndustrialAsset asset = repo.findById(id)
            .orElseThrow()
    }
}
