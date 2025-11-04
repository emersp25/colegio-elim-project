package com.colegio.elim.controller;

import com.colegio.elim.model.dto.inscripcion.InscripcionCreateDTO;
import com.colegio.elim.model.dto.inscripcion.InscripcionListDTO;
import com.colegio.elim.model.entity.Curso;
import com.colegio.elim.model.entity.Inscripcion;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.CursoRepository;
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
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InscripcionController {

    private final InscripcionRepository repo;
    private final UsuarioRepository usuarioRepo;
    private final CursoRepository cursoRepo;

    private boolean isAdmin(Authentication auth){
        return auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
    }
    private boolean isProf(Authentication auth){
        return auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_PROFESOR"));
    }
    private boolean isAlumno(Authentication auth){
        return auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ALUMNO"));
    }

    private InscripcionListDTO toDTO(Inscripcion i){
        String nombreCompleto = ((i.getAlumno().getNombre()!=null ? i.getAlumno().getNombre() : "") + " " +
                (i.getAlumno().getApellido()!=null ? i.getAlumno().getApellido() : "")).trim();
        return new InscripcionListDTO(
                i.getId(),
                i.getCurso().getId(),
                i.getCurso().getNombre(),
                i.getAlumno().getUsername(),
                nombreCompleto,
                i.getEstado(),
                i.getFechaInscripcion()
        );
    }

    // LISTAR con filtros y paginación
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public Page<InscripcionListDTO> listar(
            @RequestParam(required=false) String alumnoUsername,
            @RequestParam(required=false) Long cursoId,
            @RequestParam(required=false) String estado, // ACTIVA | CANCELADA
            Pageable pageable,
            Authentication auth
    ){
        Page<Inscripcion> page;
        if (isAdmin(auth)){
            page = repo.searchAdmin(alumnoUsername, cursoId, estado, pageable);
        } else if (isProf(auth)){
            page = repo.searchByProfesor(auth.getName(), alumnoUsername, cursoId, estado, pageable);
        } else {
            // alumno
            page = repo.searchByAlumno(auth.getName(), cursoId, estado, pageable);
        }
        return page.map(this::toDTO);
    }

    // AUTO-INSCRIPCIÓN (solo ALUMNO)
    @PostMapping("/mi")
    @PreAuthorize("hasRole('ALUMNO')")
    public ResponseEntity<?> autoInscribirse(@Valid @RequestBody InscripcionCreateDTO body, Authentication auth){
        Long cursoId = body.getCursoId();
        Curso curso = cursoRepo.findById(cursoId)
                .orElseThrow(() -> new IllegalArgumentException("Curso no existe: " + cursoId));
        if (Boolean.FALSE.equals(curso.getActivo())){
            return ResponseEntity.badRequest().body("Curso inactivo");
        }
        String alumnoUsername = auth.getName();
        if (repo.existsByCurso_IdAndAlumno_Username(cursoId, alumnoUsername)){
            return ResponseEntity.badRequest().body("Ya estás inscrito en este curso");
        }
        Usuario alumno = usuarioRepo.findByUsername(alumnoUsername)
                .orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado"));
        Inscripcion i = new Inscripcion();
        i.setAlumno(alumno);
        i.setCurso(curso);
        i.setEstado("ACTIVA");
        repo.save(i);
        return ResponseEntity.ok(toDTO(i));
    }

    // INSCRIBIR A OTRO (ADMIN o PROFESOR del curso)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> inscribir(@Valid @RequestBody InscripcionCreateDTO body, Authentication auth){
        Long cursoId = body.getCursoId();
        Curso curso = cursoRepo.findById(cursoId)
                .orElseThrow(() -> new IllegalArgumentException("Curso no existe: " + cursoId));
        if (Boolean.FALSE.equals(curso.getActivo())){
            return ResponseEntity.badRequest().body("Curso inactivo");
        }

        // Si es PROFESOR, debe ser dueño del curso
        if (isProf(auth) && !auth.getName().equals(curso.getProfesor().getUsername())){
            return ResponseEntity.status(403).body("No puedes inscribir en cursos de otros profesores");
        }

        // Resolver alumno por username (así lo tienes en el DTO)
        String alumnoUsername = body.getAlumnoUsername();
        if (alumnoUsername == null || alumnoUsername.isBlank()){
            return ResponseEntity.badRequest().body("alumnoUsername es requerido");
        }
        Usuario alumno = usuarioRepo.findByUsername(alumnoUsername)
                .orElseThrow(() -> new IllegalArgumentException("Alumno no existe: " + alumnoUsername));

        if (!"ALUMNO".equalsIgnoreCase(alumno.getRol().getNombre())){
            return ResponseEntity.badRequest().body("El usuario indicado no es ALUMNO");
        }
        if (repo.existsByCurso_IdAndAlumno_Username(cursoId, alumno.getUsername())){
            return ResponseEntity.badRequest().body("El alumno ya está inscrito en este curso");
        }

        Inscripcion i = new Inscripcion();
        i.setAlumno(alumno);
        i.setCurso(curso);
        i.setEstado("ACTIVA");
        repo.save(i);
        return ResponseEntity.ok(toDTO(i));
    }

    // DETALLE (ADMIN/PROFESOR dueño/ALUMNO propio)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> detalle(@PathVariable Long id, Authentication auth){
        Optional<Inscripcion> oi = repo.findById(id);
        if (oi.isEmpty()) return ResponseEntity.notFound().build();
        Inscripcion i = oi.get();

        if (isAdmin(auth)) return ResponseEntity.ok(toDTO(i));
        if (isProf(auth) && auth.getName().equals(i.getCurso().getProfesor().getUsername()))
            return ResponseEntity.ok(toDTO(i));
        if (isAlumno(auth) && auth.getName().equals(i.getAlumno().getUsername()))
            return ResponseEntity.ok(toDTO(i));

        return ResponseEntity.status(403).build();
    }

    // CANCELAR (estado = CANCELADA). ADMIN o PROFESOR dueño, ALUMNO solo su insc.
    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public ResponseEntity<?> cancelar(@PathVariable Long id, Authentication auth){
        return repo.findById(id).map(i -> {
            if (isAdmin(auth)
                    || (isProf(auth) && auth.getName().equals(i.getCurso().getProfesor().getUsername()))
                    || (isAlumno(auth) && auth.getName().equals(i.getAlumno().getUsername()))) {
                i.setEstado("CANCELADA");
                repo.save(i);
                return ResponseEntity.ok(toDTO(i));
            }
            return ResponseEntity.status(403).build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
