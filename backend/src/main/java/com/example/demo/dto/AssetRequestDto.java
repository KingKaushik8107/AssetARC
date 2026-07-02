package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetRequestDto
{
    private String assetTag;
    private String name;
    private String category;
    private LocalDate installDate;
    private BigDecimal purchasePrice;
    private Integer expectedLifespanYears;
}