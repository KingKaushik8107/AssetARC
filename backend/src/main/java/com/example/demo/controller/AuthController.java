package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController
{
    @Autowired
    AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterDto dto)
    {
        AuthResponseDto response = service.register(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto dto)
    {
        AuthResponseDto response = service.authenticate(dto);
        return ResponseEntity.ok(response);
    }
}
