package com.colegio.elim.controller;

import com.colegio.elim.model.dto.curso.CursoCreateDTO;
import com.colegio.elim.model.dto.curso.CursoListDTO;
import com.colegio.elim.model.dto.curso.CursoUpdateDTO;
import com.colegio.elim.model.entity.Curso;
import com.colegio.elim.model.entity.Grado;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.CursoRepository;
import com.colegio.elim.repository.GradoRepository;
import com.colegio.elim.repository.InscripcionRepository;
import com.colegio.elim.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CursoController {

    private final CursoRepository cursoRepo;
    private final GradoRepository gradoRepo;
    private final UsuarioRepository usuarioRepo;
    private final InscripcionRepository inscripcionRepo;

    // Helpers de rol (ahora sí con los nombres que tienes en BD)
    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    private boolean isProf(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROFESOR"));
    }
    private boolean isAlumno(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ALUMNO"));
    }

    // Mapper a DTO de lista (contando solo inscripciones ACTIVAS)
    private CursoListDTO toListDTO(Curso c) {
        Long inscritos = inscripcionRepo.countByCurso_IdAndEstado(c.getId(), "ACTIVA");
        return new CursoListDTO(
                c.getId(),
                c.getNombre(),
                c.getDescripcion(),
                c.getAnio(),
                c.getGrado() != null ? c.getGrado().getId() : null,
                c.getGrado() != null ? c.getGrado().getNombre() : null,
                c.getProfesor() != null ? c.getProfesor().getUsername() : null,
                c.getActivo(),
                inscritos
        );
    }

    // LISTADO por rol: ADMIN todos; PROF sus cursos; ALUM sus inscritos
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public Page<CursoListDTO> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long gradoId,
            @RequestParam(required = false) Boolean activo,
            Pageable pageable,
            Authentication auth
    ) {
        Page<Curso> page;
        if (isAdmin(auth)) {
            page = cursoRepo.search(q, gradoId, activo, pageable);
        } else if (isProf(auth)) {
            page = cursoRepo.searchByProfesor(auth.getName(), q, gradoId, activo, pageable);
        } else {
            // alumno
            page = cursoRepo.searchByAlumno(auth.getName(), q, gradoId, activo, pageable);
        }
        return page.map(this::toListDTO);
    }

    // DETALLE con autorización fina
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> detalle(@PathVariable Long id, Authentication auth) {
        Optional<Curso> oc = cursoRepo.findById(id);
        if (oc.isEmpty()) return ResponseEntity.notFound().build();
        Curso c = oc.get();

        if (isAdmin(auth)) return ResponseEntity.ok(toListDTO(c));

        if (isProf(auth)) {
            if (c.getProfesor() != null && auth.getName().equals(c.getProfesor().getUsername())) {
                return ResponseEntity.ok(toListDTO(c));
            }
            return ResponseEntity.status(403).body("No puedes ver cursos de otros profesores");
        }

        if (isAlumno(auth)) {
            boolean inscrito = inscripcionRepo.existsByCurso_IdAndAlumno_Username(id, auth.getName());
            if (inscrito) return ResponseEntity.ok(toListDTO(c));
            return ResponseEntity.status(403).body("No estás inscrito en este curso");
        }

        return ResponseEntity.status(403).build();
    }

    // CREAR: ADMIN asigna profesor; PROF se autoasigna
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> crear(@Valid @RequestBody CursoCreateDTO body, Authentication auth) {
        Grado grado = gradoRepo.findById(body.getGradoId())
                .orElseThrow(() -> new IllegalArgumentException("Grado no existe: " + body.getGradoId()));

        Usuario profesor;
        if (isProf(auth) && !isAdmin(auth)) {
            // profesor crea curso -> se asigna a sí mismo
            profesor = usuarioRepo.findByUsername(auth.getName())
                    .orElseThrow(() -> new IllegalArgumentException("Profesor actual no encontrado"));
        } else {
            // admin debe mandar profesorUsername
            if (body.getProfesorUsername() == null || body.getProfesorUsername().isBlank()) {
                return ResponseEntity.badRequest().body("profesorUsername es requerido para ADMIN");
            }
            profesor = usuarioRepo.findByUsername(body.getProfesorUsername())
                    .orElseThrow(() -> new IllegalArgumentException("Profesor no existe: " + body.getProfesorUsername()));
        }

        Curso c = new Curso();
        c.setNombre(body.getNombre());
        c.setDescripcion(body.getDescripcion());
        c.setAnio(body.getAnio());
        c.setGrado(grado);
        c.setProfesor(profesor);
        c.setActivo(body.getActivo() == null ? true : body.getActivo());
        cursoRepo.save(c);

        return ResponseEntity.ok(toListDTO(c));
    }

    // ACTUALIZAR: ADMIN todo; PROF solo si es dueño y sin cambiar profesor
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody CursoUpdateDTO body, Authentication auth) {
        return cursoRepo.findById(id).map(c -> {
            // si es profe y no admin, solo puede tocar su curso
            if (isProf(auth) && !isAdmin(auth)) {
                if (c.getProfesor() == null || !auth.getName().equals(c.getProfesor().getUsername())) {
                    return ResponseEntity.status(403).body("No puedes modificar cursos de otros profesores");
                }
            }

            if (body.getNombre() != null) c.setNombre(body.getNombre());
            if (body.getDescripcion() != null) c.setDescripcion(body.getDescripcion());
            if (body.getAnio() != null) c.setAnio(body.getAnio());
            if (body.getGradoId() != null) {
                Grado g = gradoRepo.findById(body.getGradoId())
                        .orElseThrow(() -> new IllegalArgumentException("Grado no existe: " + body.getGradoId()));
                c.setGrado(g);
            }
            if (body.getActivo() != null) c.setActivo(body.getActivo());

            if (body.getProfesorUsername() != null) {
                if (!isAdmin(auth)) {
                    return ResponseEntity.status(403).body("Solo ADMIN puede cambiar el profesor");
                }
                Usuario nuevoProf = usuarioRepo.findByUsername(body.getProfesorUsername())
                        .orElseThrow(() -> new IllegalArgumentException("Profesor no existe: " + body.getProfesorUsername()));
                c.setProfesor(nuevoProf);
            }

            cursoRepo.save(c);
            return ResponseEntity.ok(toListDTO(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!cursoRepo.existsById(id)) return ResponseEntity.notFound().build();
        cursoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}