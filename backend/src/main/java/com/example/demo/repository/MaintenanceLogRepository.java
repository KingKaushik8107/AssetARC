package com.example.demo.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.MaintenanceLog;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long>
{
    List<MaintenanceLog> findByAssetId(Long assetId);
    
    @Query("SELECT SUM(l.costIncurred) FROM MaintenanceLog l WHERE l.asset.id = :assetId")
    BigDecimal sumCostByAssetId(@Param("assetId") Long assetId);
}
