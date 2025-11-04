package com.colegio.elim.controller;

import com.colegio.elim.model.dto.UsuarioCreateDTO;
import com.colegio.elim.model.dto.UsuarioUpdateDTO;
import com.colegio.elim.model.dto.usuario.UsuarioListDTO;
import com.colegio.elim.model.entity.Rol;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.RolRepository;
import com.colegio.elim.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // <- IMPORTA ESTE
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <- IMPORTA ESTE
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@SuppressWarnings("DuplicatedCode")
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repo;
    private final RolRepository rolRepo;
    private final PasswordEncoder encoder;

    public UsuarioController(UsuarioRepository repo, RolRepository rolRepo, PasswordEncoder encoder) {
        this.repo = repo; this.rolRepo = rolRepo; this.encoder = encoder;
    }

    // LISTADO PAGINADO + BUSQUEDA (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UsuarioListDTO> listar(@RequestParam(required = false) String q, Pageable pageable) {
        return repo.search(q, pageable)
                .map(u -> new UsuarioListDTO(
                        u.getId(),
                        u.getUsername(),
                        ( (u.getNombre() != null ? u.getNombre() : "")
                                + " " +
                                (u.getApellido() != null ? u.getApellido() : "")
                        ).trim(),
                        u.getEmail(),
                        u.getRol() != null ? u.getRol().getNombre() : null // entidad Rol -> getNombre()
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UsuarioCreateDTO body) {
        if (repo.existsByUsername(body.username())) return ResponseEntity.badRequest().body("username ya existe");
        if (repo.existsByEmail(body.email())) return ResponseEntity.badRequest().body("email ya existe");

        Rol rol = rolRepo.findByNombre(body.rolNombre())
                .orElseThrow(() -> new RuntimeException("Rol no existe: " + body.rolNombre()));

        Usuario u = new Usuario();
        u.setUsername(body.username());
        u.setEmail(body.email());
        u.setNombre(body.nombre());
        u.setApellido(body.apellido());
        u.setPassword(encoder.encode(body.password()));
        u.setRol(rol);
        u.setActivo(true);
        repo.save(u);
        return ResponseEntity.ok(u);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UsuarioUpdateDTO body) {
        return repo.findById(id).map(u -> {
            if (body.email() != null) u.setEmail(body.email());
            if (body.nombre() != null) u.setNombre(body.nombre());
            if (body.apellido() != null) u.setApellido(body.apellido());
            if (body.password() != null && !body.password().isBlank()) u.setPassword(encoder.encode(body.password()));
            if (body.rolNombre() != null) {
                Rol rol = rolRepo.findByNombre(body.rolNombre())
                        .orElseThrow(() -> new RuntimeException("Rol no existe: " + body.rolNombre()));
                u.setRol(rol);
            }
            if (body.activo() != null) u.setActivo(body.activo());
            repo.save(u);
            return ResponseEntity.ok(u);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
