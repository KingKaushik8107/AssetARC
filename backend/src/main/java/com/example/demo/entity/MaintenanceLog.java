package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "maintenance_logs")
public class MaintenanceLog
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id",nullable = false)
    private IndustrialAsset asset;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id",unique = true)
    private MaintenanceSchedule schedule;

    @Column(name = "completion_date",nullable = false)
    private LocalDateTime completionDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "technician_id",nullable)

}
