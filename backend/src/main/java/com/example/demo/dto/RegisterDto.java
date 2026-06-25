package com.example.demo.dto;

import com.example.demo.enums.Role;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto
{
    private String username;
    private String password;
    private Role role;
}
