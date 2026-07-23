package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
        private final SystemUserRepository userRepository;
        private final IndustrialAssetRepository assetRepository;
        private final MaintenanceScheduleRepository scheduleRepository;
        private final MaintenanceLogRepository logRepository;
        private final HealthMetricRepository healthRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                seedUsers();
                seedData();
        }

        private void seedUsers() {
                if (userRepository.count() == 0) {
                        userRepository.save(SystemUser.builder()
                                        .username("admin")
                                        .password(passwordEncoder.encode("admin123"))
                                        .role(SystemUser.Role.SYSTEM_ADMIN)
                                        .build());

                        userRepository.save(SystemUser.builder()
                                        .username("manager")
                                        .password(passwordEncoder.encode("manager123"))
                                        .role(SystemUser.Role.ASSET_MANAGER)
                                        .build());

                        userRepository.save(SystemUser.builder()
                                        .username("tech")
                                        .password(passwordEncoder.encode("tech123"))
                                        .role(SystemUser.Role.MAINTENANCE_TECHNICIAN)
                                        .build());

                        userRepository.save(SystemUser.builder()
                                        .username("supervisor")
                                        .password(passwordEncoder.encode("super123"))
                                        .role(SystemUser.Role.OPERATIONS_SUPERVISOR)
                                        .build());
                }
        }

        private void seedData()
        {
                if (assetRepository.count() == 0)
                {
                        IndustrialAsset cnc = assetRepository.findByAssetTag("CNC-001")
                                        .orElseGet(() -> assetRepository.save(IndustrialAsset.builder()
                                                        .assetTag("CNC-001")
                                                        .name("Main CNC Machine")
                                                        .category("MANUFACTURING")
                                                        .installDate(LocalDate.now().minusYears(2))
                                                        .purchasePrice(new BigDecimal("55000.00"))
                                                        .expectedLifespanYears(10)
                                                        .currentStatus(IndustrialAsset.AssetStatus.ACTIVE)
                                                        .currentHealth(95)
                                                        .build()));

                        IndustrialAsset forklift = IndustrialAsset.builder()
                                        .assetTag("FL-202")
                                        .name("Heavy Duty Forklift")
                                        .category("LOGISTICS")
                                        .installDate(LocalDate.now().minusYears(1))
                                        .purchasePrice(new BigDecimal("25000.00"))
                                        .expectedLifespanYears(8)
                                        .currentStatus(IndustrialAsset.AssetStatus.ACTIVE)
                                        .currentHealth(88)
                                        .build();

                        IndustrialAsset boiler = IndustrialAsset.builder()
                                        .assetTag("BLR-05")
                                        .name("Industrial Steam Boiler")
                                        .category("UTILITIES")
                                        .installDate(LocalDate.now().minusYears(5))
                                        .purchasePrice(new BigDecimal("120000.00"))
                                        .expectedLifespanYears(15)
                                        .currentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE)
                                        .currentHealth(65)
                                        .build();

                        IndustrialAsset conveyor = IndustrialAsset.builder()
                                        .assetTag("CV-101")
                                        .name("Assembly Line Conveyor")
                                        .category("MANUFACTURING")
                                        .installDate(LocalDate.now().minusYears(3))
                                        .purchasePrice(new BigDecimal("45000.00"))
                                        .expectedLifespanYears(12)
                                        .currentStatus(IndustrialAsset.AssetStatus.ACTIVE)
                                        .currentHealth(91)
                                        .build();

                        IndustrialAsset pump = IndustrialAsset.builder()
                                        .assetTag("PMP-404")
                                        .name("Retired Cooling Pump")
                                        .category("UTILITIES")
                                        .installDate(LocalDate.now().minusYears(8))
                                        .purchasePrice(new BigDecimal("12000.00"))
                                        .expectedLifespanYears(7)
                                        .currentStatus(IndustrialAsset.AssetStatus.DECOMMISSIONED)
                                        .currentHealth(15)
                                        .build();

                        IndustrialAsset generator = IndustrialAsset.builder()
                                        .assetTag("GEN-77")
                                        .name("Emergency Generator")
                                        .category("UTILITIES")
                                        .installDate(LocalDate.now().minusYears(4))
                                        .purchasePrice(new BigDecimal("35000.00"))
                                        .expectedLifespanYears(15)
                                        .currentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE)
                                        .currentHealth(42)
                                        .build();

                        assetRepository.saveAll(Arrays.asList(cnc, forklift, boiler, conveyor, pump, generator));

                        // Seed Schedules
                        MaintenanceSchedule s1 = MaintenanceSchedule.builder()
                                        .asset(cnc)
                                        .plannedDate(LocalDate.now().plusDays(5))
                                        .maintenanceType(MaintenanceSchedule.MaintenanceType.ROUTINE)
                                        .priority(MaintenanceSchedule.Priority.MEDIUM)
                                        .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                                        .build();

                        MaintenanceSchedule s2 = MaintenanceSchedule.builder()
                                        .asset(boiler)
                                        .plannedDate(LocalDate.now().minusDays(1))
                                        .maintenanceType(MaintenanceSchedule.MaintenanceType.REPAIR)
                                        .priority(MaintenanceSchedule.Priority.CRITICAL)
                                        .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                                        .build();

                        MaintenanceSchedule s3 = MaintenanceSchedule.builder()
                                        .asset(conveyor)
                                        .plannedDate(LocalDate.now().minusDays(15))
                                        .maintenanceType(MaintenanceSchedule.MaintenanceType.INSPECTION)
                                        .priority(MaintenanceSchedule.Priority.LOW)
                                        .status(MaintenanceSchedule.ScheduleStatus.CANCELLED)
                                        .build();

                        MaintenanceSchedule s4 = MaintenanceSchedule.builder()
                                        .asset(cnc)
                                        .plannedDate(LocalDate.now().minusDays(30))
                                        .maintenanceType(MaintenanceSchedule.MaintenanceType.ROUTINE)
                                        .priority(MaintenanceSchedule.Priority.MEDIUM)
                                        .status(MaintenanceSchedule.ScheduleStatus.COMPLETED)
                                        .build();

                        MaintenanceSchedule s5 = MaintenanceSchedule.builder()
                                        .asset(generator)
                                        .plannedDate(LocalDate.now().plusDays(2))
                                        .maintenanceType(MaintenanceSchedule.MaintenanceType.REPAIR)
                                        .priority(MaintenanceSchedule.Priority.HIGH)
                                        .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                                        .build();

                        scheduleRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5));

                        // Seed Logs
                       SystemUser tech = userRepository.findByUsername("tech").orElseThrow();

                        MaintenanceLog l1 = MaintenanceLog.builder()
                                        .asset(forklift)
                                        .technician(tech)
                                        .completionDate(LocalDateTime.now().minusDays(10))
                                        .workDescription("Hydraulic fluid replacement and tire inspection.")
                                        .costIncurred(new BigDecimal("450.00"))
                                        .build();

                        MaintenanceLog l2 = MaintenanceLog.builder()
                                        .asset(cnc)
                                        .schedule(s4)
                                        .technician(tech)
                                        .completionDate(LocalDateTime.now().minusDays(30))
                                        .workDescription("Quarterly routine calibration and software update.")
                                        .costIncurred(new BigDecimal("1200.00"))
                                        .build();

                        MaintenanceLog l3 = MaintenanceLog.builder()
                                        .asset(boiler)
                                        .technician(tech)
                                        .completionDate(LocalDateTime.now().minusMonths(3))
                                        .workDescription("Safety valve replacement and pressure test.")
                                        .costIncurred(new BigDecimal("850.50"))
                                        .build();

                        logRepository.saveAll(Arrays.asList(l1, l2, l3));

                        // Seed Health Metrics
                        healthRepository.save(HealthMetric.builder()
                                        .asset(cnc)
                                        .recordedAt(LocalDateTime.now())
                                        .healthScore(92)
                                        .vibrationLevel(0.02)
                                        .temperatureCelsius(45.5)
                                        .build());

                        healthRepository.save(HealthMetric.builder()
                                        .asset(boiler)
                                        .recordedAt(LocalDateTime.now())
                                        .healthScore(65)
                                        .vibrationLevel(0.15)
                                        .temperatureCelsius(120.0)
                                        .build());

                        healthRepository.save(HealthMetric.builder()
                                        .asset(generator)
                                        .recordedAt(LocalDateTime.now())
                                        .healthScore(42)
                                        .vibrationLevel(0.28)
                                        .temperatureCelsius(88.0)
                                        .build());
                }
        }
}
