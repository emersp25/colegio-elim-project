package com.colegio.elim.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*")
public class AlumnoController {
    @GetMapping
    public ResponseEntity<List<?>> list() { return ResponseEntity.ok(List.of()); }
}
