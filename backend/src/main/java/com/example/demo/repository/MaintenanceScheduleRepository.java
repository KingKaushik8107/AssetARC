package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.enums.ScheduleStatus;

@Repository
public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule,Long>
{
    List<MaintenanceSchedule>findByAssetIdAndStatus(Long assetId,ScheduleStatus status);
    List<MaintenanceSchedule>findByStatus(ScheduleStatus status);

    @Query("SELECT s FROM MaintenanceSchedule s WHERE s.status = 'PENDING'")
    List<MaintenanceSchedule>findPendingSchedules();
}
