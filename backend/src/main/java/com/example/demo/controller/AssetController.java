package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.AssetService;

@RestController
@RequestMapping("/api/assets")
public class AssetController
{
    @Autowired
    AssetService service;

    @PostMapping("")
}
