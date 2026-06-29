package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.ResourceNotFoundException;
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

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterDto dto)
    {
        SystemUser user = SystemUser.builder()
            .username(dto.getUsername())
            .password(passwordEncoder.encode(dto.getPassword()))
            .role(dto.getRole())
            .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
            .token(token)
            .id(user.getId())
            .username(user.getUsername())
            .role(user.getRole().name())
            .build();
    }

    public AuthResponseDto authenticate(AuthRequestDto dto)
    {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                dto.getUsername(),
                dto.getPassword()
            )
        );

        SystemUser user = userRepository.findByUsername(dto.getUsername())
            .orElseThrow( ()-> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
            .token(token)
            .id(user.getId())
            .username(user.getUsername())
            .role(user.getRole().name())
            .build();
    }
}
