package com.colegio.elim.controller;

import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthExtraController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    public AuthExtraController(UsuarioRepository usuarioRepo, PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo; this.encoder = encoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        var u = usuarioRepo.findByUsername(auth.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(new MeDTO(u));
    }

    public record MeDTO(Long id, String username, String nombre, String apellido, String email, String rol) {
        public MeDTO(Usuario u){ this(u.getId(), u.getUsername(), u.getNombre(), u.getApellido(), u.getEmail(), u.getRol().getNombre()); }
    }

    public record ChangePasswordDTO(String oldPassword, String newPassword) {}

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication auth, @RequestBody ChangePasswordDTO dto) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        var u = usuarioRepo.findByUsername(auth.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        if (dto.newPassword()==null || dto.newPassword().length()<6)
            return ResponseEntity.badRequest().body("Nueva contraseña demasiado corta");
        if (!encoder.matches(dto.oldPassword(), u.getPassword()))
            return ResponseEntity.status(400).body("Contraseña actual incorrecta");

        u.setPassword(encoder.encode(dto.newPassword()));
        usuarioRepo.save(u);
        return ResponseEntity.noContent().build();
    }
}
