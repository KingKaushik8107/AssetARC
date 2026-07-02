package com.example.demo.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogRequestDto
{
    private Long scheduleId;
    private String workDescription;
    private BigDecimal costIncurred;
    private Long technicianId;
}