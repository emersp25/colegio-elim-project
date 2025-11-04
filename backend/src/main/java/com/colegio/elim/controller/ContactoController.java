package com.colegio.elim.controller;

import com.colegio.elim.model.dto.contacto.ContactoRequest;
import com.colegio.elim.model.entity.Contacto;
import com.colegio.elim.repository.ContactoRepository;
import com.colegio.elim.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContactoController {

    private final ContactoRepository repo;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ContactoRequest req) {
        Contacto c = new Contacto();
        c.setNombre(req.getNombre());
        c.setEmail(req.getEmail());
        c.setTelefono(req.getTelefono());
        c.setMensaje(req.getMensaje());
        repo.save(c);

        try {
            emailService.enviarContacto(req);
        } catch (Exception ignored) { /* no rompas el flujo si falla el correo */ }

        return ResponseEntity.ok(c);
    }

    // Solo ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(repo.findAll());
    }

    // Solo ADMIN
    @PutMapping("/{id}/atender")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atender(@PathVariable Long id) {
        return repo.findById(id).map(c -> {
            c.setAtendido(true);
            repo.save(c);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }
}
