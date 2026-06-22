package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "industrial_assets")
public class HealthMetric
{
    @Id
    @GeneratedValue()
    private Long id;
}