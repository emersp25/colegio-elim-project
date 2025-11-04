package com.colegio.elim.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profesores")
@CrossOrigin(origins = "*")
public class ProfesorController {
    @GetMapping
    public ResponseEntity<List<?>> list() { return ResponseEntity.ok(List.of()); }

    @PostMapping
    public ResponseEntity<?> crear() { return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(Map.of("message","Implementar")); }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id) { return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(Map.of("message","Implementar")); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) { return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(Map.of("message","Implementar")); }
}
