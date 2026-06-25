package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.enums.MaintenanceType;
import com.example.demo.enums.Priority;

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
