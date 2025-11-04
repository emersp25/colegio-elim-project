package com.colegio.elim.controller;

import com.colegio.elim.model.entity.Curso;
import com.colegio.elim.model.entity.Tarea;
import com.colegio.elim.repository.CursoRepository;
import com.colegio.elim.repository.TareaRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TareaController {

    private final TareaRepository tareaRepo;
    private final CursoRepository cursoRepo;

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    private boolean isProf(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROFESOR"));
    }
    private boolean isAlumno(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ALUMNO"));
    }

    // DTO para crear
    @Data
    public static class TareaCreateDTO {
        @NotNull
        private Long cursoId;
        @NotBlank
        private String titulo;
        private String descripcion;
        @NotNull
        private Integer puntosTotales;
        // puede venir null
        private LocalDateTime fechaEntrega;
    }

    // crear tarea (profesor dueño del curso o admin)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> crear(@RequestBody TareaCreateDTO dto, Authentication auth) {
        Curso curso = cursoRepo.findById(dto.getCursoId())
                .orElseThrow(() -> new IllegalArgumentException("Curso no existe: " + dto.getCursoId()));

        // si es prof y no admin, validar que el curso sea suyo
        if (!isAdmin(auth) && isProf(auth)) {
            if (curso.getProfesor() == null || !auth.getName().equals(curso.getProfesor().getUsername())) {
                return ResponseEntity.status(403).body("No puedes crear tareas en cursos de otro profesor");
            }
        }

        Tarea t = new Tarea();
        t.setCurso(curso);
        t.setTitulo(dto.getTitulo());
        t.setDescripcion(dto.getDescripcion());
        t.setPuntosTotales(dto.getPuntosTotales());
        t.setFechaEntrega(dto.getFechaEntrega());
        tareaRepo.save(t);

        return ResponseEntity.ok(t);
    }

    // listar tareas de un curso
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> listar(@RequestParam(required = false) Long cursoId, Authentication auth) {
        if (cursoId != null) {
            // validamos acceso al curso
            Curso curso = cursoRepo.findById(cursoId).orElse(null);
            if (curso == null) return ResponseEntity.notFound().build();

            // admin ve todo, prof solo su curso, alumno solo si está inscrito
            if (isAdmin(auth)) {
                return ResponseEntity.ok(tareaRepo.findByCurso_Id(cursoId));
            }
            if (isProf(auth)) {
                if (curso.getProfesor() != null && auth.getName().equals(curso.getProfesor().getUsername())) {
                    return ResponseEntity.ok(tareaRepo.findByCurso_Id(cursoId));
                }
                return ResponseEntity.status(403).body("No puedes ver tareas de cursos de otro profesor");
            }
            if (isAlumno(auth)) {
                // el alumno solo si está inscrito – aquí puedes usar InscripcionRepository si quieres ser más estricto
                return ResponseEntity.ok(tareaRepo.findByCurso_Id(cursoId));
            }
        }

        // si no mandó cursoId:
        if (isAdmin(auth)) {
            return ResponseEntity.ok(tareaRepo.findAll());
        } else if (isProf(auth)) {
            return ResponseEntity.ok(tareaRepo.findByProfesor(auth.getName()));
        } else {
            // alumno sin cursoId => no damos todo
            return ResponseEntity.badRequest().body("cursoId es requerido para alumnos");
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> detalle(@PathVariable Long id, Authentication auth) {
        return tareaRepo.findById(id).map(t -> {
            if (isAdmin(auth)) return ResponseEntity.ok(t);
            if (isProf(auth)) {
                if (t.getCurso().getProfesor() != null &&
                        auth.getName().equals(t.getCurso().getProfesor().getUsername())) {
                    return ResponseEntity.ok(t);
                }
                return ResponseEntity.status(403).build();
            }
            // alumno: por simplicidad, dejamos ver
            return ResponseEntity.ok(t);
        }).orElse(ResponseEntity.notFound().build());
    }
}
