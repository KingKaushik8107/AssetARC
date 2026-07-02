package com.example.demo.repository;

import com.example.demo.entity.MaintenanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, Long> {
    List<MaintenanceSchedule> findByAssetIdAndStatus(Long assetId, ScheduleStatus status);
    List<MaintenanceSchedule> findByStatus(ScheduleStatus status);
    @org.springframework.data.jpa.repository.Query("SELECT s FROM MaintenanceSchedule s WHERE s.status = 'PENDING'")
    List<MaintenanceSchedule> findPendingSchedules();
}
