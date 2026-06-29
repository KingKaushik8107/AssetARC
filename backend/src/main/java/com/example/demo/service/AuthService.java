package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.SystemUserRepository;
import com.example.demo.security.JwtService;

@Service
public class AuthService
{
    @Autowired
    SystemUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autow
}
