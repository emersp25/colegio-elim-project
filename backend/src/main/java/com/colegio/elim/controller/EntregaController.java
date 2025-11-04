package com.colegio.elim.controller;

import com.colegio.elim.model.entity.Entrega;
import com.colegio.elim.model.entity.Nota;
import com.colegio.elim.model.entity.Tarea;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.EntregaRepository;
import com.colegio.elim.repository.NotaRepository;
import com.colegio.elim.repository.TareaRepository;
import com.colegio.elim.repository.UsuarioRepository;
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
@RequestMapping("/api/entregas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EntregaController {

    private final EntregaRepository entregaRepo;
    private final TareaRepository tareaRepo;
    private final UsuarioRepository usuarioRepo;
    private final NotaRepository notaRepo;

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    private boolean isProf(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROFESOR"));
    }
    private boolean isAlumno(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ALUMNO"));
    }

    // 1) Alumno entrega
    @Data
    public static class EntregaCreateDTO {
        @NotNull
        private Long tareaId;
        @NotBlank
        private String contenido; // link / texto
    }

    @PostMapping
    @PreAuthorize("hasRole('ALUMNO')")
    public ResponseEntity<?> crear(@RequestBody EntregaCreateDTO dto, Authentication auth) {
        Tarea tarea = tareaRepo.findById(dto.getTareaId())
                .orElseThrow(() -> new IllegalArgumentException("Tarea no existe: " + dto.getTareaId()));

        // alumno actual
        Usuario alumno = usuarioRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Alumno no existe"));

        // evitar doble entrega
        if (entregaRepo.existsByTarea_IdAndAlumno_Username(tarea.getId(), alumno.getUsername())) {
            return ResponseEntity.badRequest().body("Ya entregaste esta tarea");
        }

        Entrega e = new Entrega();
        e.setTarea(tarea);
        e.setAlumno(alumno);
        e.setContenido(dto.getContenido());
        e.setFechaEntrega(LocalDateTime.now());
        entregaRepo.save(e);

        return ResponseEntity.ok(e);
    }

    // 2) Profesor/alumno ven entregas de una tarea
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> listar(@RequestParam(required = false) Long tareaId, Authentication auth) {
        if (isAdmin(auth)) {
            if (tareaId != null) {
                return ResponseEntity.ok(entregaRepo.findByTarea_Id(tareaId));
            }
            return ResponseEntity.ok(entregaRepo.findAll());
        }

        if (isProf(auth)) {
            // prof solo las suyas
            if (tareaId != null) {
                // validar que la tarea es suya
                Tarea tarea = tareaRepo.findById(tareaId).orElse(null);
                if (tarea == null) return ResponseEntity.notFound().build();
                if (!auth.getName().equals(tarea.getCurso().getProfesor().getUsername())) {
                    return ResponseEntity.status(403).build();
                }
                return ResponseEntity.ok(entregaRepo.findByTarea_Id(tareaId));
            } else {
                return ResponseEntity.ok(entregaRepo.findByProfesor(auth.getName()));
            }
        }

        if (isAlumno(auth)) {
            // alumno: por simplicidad, devolvemos solo sus entregas
            // podrías crear un método en repo para esto; aquí filtro en memoria
            List<Entrega> todas = entregaRepo.findAll();
            return ResponseEntity.ok(
                    todas.stream()
                            .filter(e -> e.getAlumno().getUsername().equals(auth.getName()))
                            .toList()
            );
        }

        return ResponseEntity.status(403).build();
    }

    // 3) Profesor califica
    @Data
    public static class CalificacionDTO {
        @NotNull
        private Integer calificacion; // 0..100 o 0..puntos
        private String observaciones;
        private boolean registrarNota; // si quiere que se guarde en tabla notas
    }

    @PutMapping("/{id}/calificar")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> calificar(@PathVariable Long id,
                                       @RequestBody CalificacionDTO dto,
                                       Authentication auth) {
        return entregaRepo.findById(id).map(e -> {
            // validar que el prof es dueño del curso de la tarea
            if (!isAdmin(auth)) {
                String profUsername = e.getTarea().getCurso().getProfesor().getUsername();
                if (!auth.getName().equals(profUsername)) {
                    return ResponseEntity.status(403).body("No puedes calificar entregas de otro profesor");
                }
            }

            e.setCalificacion(dto.getCalificacion());
            e.setObservaciones(dto.getObservaciones());
            entregaRepo.save(e);

            // opcional: registro en tabla notas
            if (dto.isRegistrarNota()) {
                Nota n = new Nota();
                n.setAlumno(e.getAlumno());
                n.setCurso(e.getTarea().getCurso());
                n.setNota(dto.getCalificacion());
                n.setTipo("TAREA");
                n.setComentario(dto.getObservaciones());
                notaRepo.save(n);
            }

            return ResponseEntity.ok(e);
        }).orElse(ResponseEntity.notFound().build());
    }
}
