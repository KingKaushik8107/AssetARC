package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.IndustrialAsset.AssetStatus;

import java.util.Optional;

public interface IndustrialAssetRepository extends JpaRepository<IndustrialAsset, Long>
{
    Optional<IndustrialAsset> findByAssetTag(String assetTag);
    long countByCurrentStatus(AssetStatus status);
}
