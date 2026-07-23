package com.example.demo.config;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.SystemUser;
import com.example.demo.entity.SystemUser.Role;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.IndustrialAsset.AssetStatus;
import com.example.demo.repository.IndustrialAssetRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final IndustrialAssetRepository assetRepository;
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
                    .role(Role.SYSTEM_ADMIN)
                    .build());

            userRepository.save(SystemUser.builder()
                    .username("manager")
                    .password(passwordEncoder.encode("manager123"))
                    .role(Role.ASSET_MANAGER)
                    .build());

            userRepository.save(SystemUser.builder()
                    .username("tech")
                    .password(passwordEncoder.encode("tech123"))
                    .role(Role.MAINTENANCE_TECHNICIAN)
                    .build());

            userRepository.save(SystemUser.builder()
                    .username("supervisor")
                    .password(passwordEncoder.encode("super123"))
                    .role(Role.OPERATIONS_SUPERVISOR)
                    .build());

             userRepository.save(SystemUser.builder()
                    .username("string")
                    .password(passwordEncoder.encode("string"))
                    .role(Role.SYSTEM_ADMIN)
                    .build());
        }
    }

    private void seedData() {

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

        }
    }
}