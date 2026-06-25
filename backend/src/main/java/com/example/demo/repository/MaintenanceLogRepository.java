package com.example.demo.repository;

import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.MaintenanceLog;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog,Long>
{
    List<MaintenanceLog> findByAssetId(Long assetId);
    
    @Query("SELECT SUM(I,costIncurred) FROM MaintenanceLog I WHERE I.asset.id = assetId")
    BigDecimal sumCostByAssetId(@Param("assetId") Long assetId);
    
}
