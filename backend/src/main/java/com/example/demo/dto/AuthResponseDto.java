package com.example.demo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto
{
    private String token;
    private Long id;
    private String username;
    private String role;    
}
