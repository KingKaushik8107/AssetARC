package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.IndustrialAsset;

@Repository
public interface IndustrialAssetRepository extends JpaRepository<IndustrialAsset,Long>
{
    Optional<IndustrialAsset>findByAssetTag(String assetTag)
}
