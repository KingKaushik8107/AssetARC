package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.enums.MaintenanceType;

public class ScheduleRequestDto
{
    private Long assetId;
    private LocalDate plannedDate;
    private MaintenanceType maintenanceType;
    private Prio priority;
}
