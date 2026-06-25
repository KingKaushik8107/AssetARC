package com.example.demo.repository;

import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.MaintenanceLog;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog,Long>
{
    @Query("SELECT SUM(I,costIncurred) FROM MaintenanceLog I ")
    List<MaintenanceLog> findByAssetId(Long assetId);
    
}
