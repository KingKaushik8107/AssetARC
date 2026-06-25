package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.MaintenanceLog;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog,Long>
{
    List<MaintenanceLog> findByAssetId(Long assetId);
    
}
