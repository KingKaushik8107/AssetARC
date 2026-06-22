package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class SystemUser
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @
    private 
}
