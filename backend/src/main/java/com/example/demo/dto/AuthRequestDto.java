package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDto
{
    private String token;
    private Long id;
    private String username;
    private String installDate;
    private BigDecimal purchaseprice;
    private Integer expectedLifespanYears;

}
