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
        }
    }

    // private void seedData() {

    //     if (assetRepository.count() == 0) {

    //         assetRepository.save(
    //                 IndustrialAsset.builder()
    //                         .assetTag("CNC-2024-X1")
    //                         .name("CNC Machine")
    //                         .category("Manufacturing")
    //                         .installDate(LocalDate.now())
    //                         .purchasePrice(BigDecimal.valueOf(500000))
    //                         .expectedLifespanYears(10)
    //                         .currentStatus(AssetStatus.ACTIVE)
    //                         .currentHealth(100)
    //                         .build());
    //     }
    // }
}