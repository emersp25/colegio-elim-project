package com.colegio.elim.controller;

import com.colegio.elim.model.dto.LoginRequestDTO;
import com.colegio.elim.model.dto.LoginResponseDTO;
import com.colegio.elim.model.dto.RegisterRequestDTO;
import com.colegio.elim.model.entity.Rol;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.RolRepository;
import com.colegio.elim.repository.UsuarioRepository;
import com.colegio.elim.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final RolRepository rolRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwt;

    public AuthController(UsuarioRepository usuarioRepo, RolRepository rolRepo, PasswordEncoder encoder, JwtTokenProvider jwt) {
        this.usuarioRepo = usuarioRepo;
        this.rolRepo = rolRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO req) {
        var opt = usuarioRepo.findByUsername(req.username());
        if (opt.isEmpty()) return ResponseEntity.status(401).body("Usuario o contraseña inválidos");
        var u = opt.get();
        if (!encoder.matches(req.password(), u.getPassword())) return ResponseEntity.status(401).body("Usuario o contraseña inválidos");

        var token = jwt.generateToken(u);
        var resp = new LoginResponseDTO(token, u.getUsername(), u.getRol().getNombre(), u.getNombre() + " " + u.getApellido());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO r) {
        if (usuarioRepo.existsByUsername(r.username())) return ResponseEntity.badRequest().body("username ya existe");
        if (usuarioRepo.existsByEmail(r.email())) return ResponseEntity.badRequest().body("email ya existe");

        Rol rolAlumno = rolRepo.findByNombre("ALUMNO").orElseThrow(() -> new RuntimeException("Rol ALUMNO no configurado"));

        Usuario u = new Usuario();
        u.setUsername(r.username());
        u.setEmail(r.email());
        u.setNombre(r.nombre());
        u.setApellido(r.apellido());
        u.setPassword(encoder.encode(r.password()));
        u.setRol(rolAlumno);
        u.setActivo(true);
        usuarioRepo.save(u);

        var token = jwt.generateToken(u);
        var resp = new LoginResponseDTO(token, u.getUsername(), u.getRol().getNombre(), u.getNombre() + " " + u.getApellido());
        return ResponseEntity.ok(resp);
    }
}
