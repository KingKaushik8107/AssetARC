package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.entity.MaintenanceSchedule.MaintenanceType;
import com.example.demo.entity.MaintenanceSchedule.Priority;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequestDto
{
    private Long assetId;
    private LocalDate plannedDate;
    private MaintenanceType maintenanceType;
    private Priority priority;
}
