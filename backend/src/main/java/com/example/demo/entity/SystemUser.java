package com.example.demo.entity;

import com.example.demo.enums.Role;

import jakarta.persistence.*;

@Entity
@Table(name = "system_users")
public class SystemUser
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private enum role;
}
