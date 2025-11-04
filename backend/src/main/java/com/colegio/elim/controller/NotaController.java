package com.colegio.elim.controller;

import com.colegio.elim.model.dto.nota.NotaCreateDTO;
import com.colegio.elim.model.dto.nota.NotaListDTO;
import com.colegio.elim.model.dto.nota.NotaUpdateDTO;
import com.colegio.elim.model.entity.Curso;
import com.colegio.elim.model.entity.Nota;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.CursoRepository;
import com.colegio.elim.repository.InscripcionRepository;
import com.colegio.elim.repository.NotaRepository;
import com.colegio.elim.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NotaController {

    private final NotaRepository notaRepo;
    private final CursoRepository cursoRepo;
    private final UsuarioRepository usuarioRepo;
    private final InscripcionRepository inscripcionRepo;

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    private boolean isProf(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROFESOR"));
    }
    private boolean isAlumno(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ALUMNO"));
    }

    private NotaListDTO toDTO(Nota n){
        String nombreCompleto = (
                (n.getAlumno().getNombre() != null ? n.getAlumno().getNombre() : "")
                        + " "
                        + (n.getAlumno().getApellido() != null ? n.getAlumno().getApellido() : "")
        ).trim();

        return new NotaListDTO(
                n.getId(),
                n.getCurso().getId(),
                n.getCurso().getNombre(),
                n.getAlumno().getUsername(),
                nombreCompleto,
                n.getNota(),
                n.getTipo(),
                n.getComentario(),
                n.getFechaRegistro()
        );
    }

    // ================= LISTAR =================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR','ALUMNO')")
    public Page<NotaListDTO> listar(
            @RequestParam(required = false) String alumnoUsername,
            @RequestParam(required = false) Long cursoId,
            Pageable pageable,
            Authentication auth
    ) {
        Page<Nota> page;
        if (isAdmin(auth)) {
            // admin puede filtrar por alumno y curso
            page = notaRepo.searchAdmin(alumnoUsername, cursoId, pageable);
        } else if (isProf(auth)) {
            // prof ve solo las notas de sus cursos
            page = notaRepo.searchByProfesor(auth.getName(), alumnoUsername, cursoId, pageable);
        } else {
            // alumno: solo sus notas, aunque mande otro alumnoUsername lo ignoramos
            page = notaRepo.searchByAlumno(auth.getName(), cursoId, pageable);
        }
        return page.map(this::toDTO);
    }

    // ================= CREAR =================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> crear(@Valid @RequestBody NotaCreateDTO body, Authentication auth) {
        Curso curso = cursoRepo.findById(body.getCursoId())
                .orElseThrow(() -> new IllegalArgumentException("Curso no existe: " + body.getCursoId()));
        Usuario alumno = usuarioRepo.findByUsername(body.getAlumnoUsername())
                .orElseThrow(() -> new IllegalArgumentException("Alumno no existe: " + body.getAlumnoUsername()));

        // profesor solo puede calificar cursos suyos
        if (isProf(auth) && !auth.getName().equals(curso.getProfesor().getUsername())) {
            return ResponseEntity.status(403).body("No puedes calificar cursos de otros profesores");
        }

        // validar que el alumno esté inscrito
        boolean inscrito = inscripcionRepo.existsByCurso_IdAndAlumno_Username(curso.getId(), alumno.getUsername());
        if (!inscrito) {
            return ResponseEntity.badRequest().body("El alumno no está inscrito en el curso");
        }

        // rango de nota
        if (body.getNota() < 0 || body.getNota() > 100) {
            return ResponseEntity.badRequest().body("La nota debe estar entre 0 y 100");
        }

        Nota n = new Nota();
        n.setCurso(curso);
        n.setAlumno(alumno);
        n.setNota(body.getNota());
        n.setTipo(body.getTipo());
        n.setComentario(body.getComentario());
        // fechaRegistro ya la pone la entidad
        notaRepo.save(n);

        return ResponseEntity.ok(toDTO(n));
    }

    // ================= ACTUALIZAR =================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @Valid @RequestBody NotaUpdateDTO body,
                                        Authentication auth) {
        return notaRepo.findById(id).map(n -> {
            // prof solo su curso
            if (isProf(auth) && !auth.getName().equals(n.getCurso().getProfesor().getUsername())) {
                return ResponseEntity.status(403).body("No puedes modificar notas de cursos de otros profesores");
            }

            if (body.getNota() != null) {
                if (body.getNota() < 0 || body.getNota() > 100) {
                    return ResponseEntity.badRequest().body("La nota debe estar entre 0 y 100");
                }
                n.setNota(body.getNota());
            }
            if (body.getTipo() != null) n.setTipo(body.getTipo());
            if (body.getComentario() != null) n.setComentario(body.getComentario());

            notaRepo.save(n);
            return ResponseEntity.ok(toDTO(n));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ================= ELIMINAR =================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESOR')")
    public ResponseEntity<?> eliminar(@PathVariable Long id, Authentication auth) {
        return notaRepo.findById(id).map(n -> {
            if (isProf(auth) && !auth.getName().equals(n.getCurso().getProfesor().getUsername())) {
                return ResponseEntity.status(403).body("No puedes eliminar notas de cursos de otros profesores");
            }
            notaRepo.delete(n);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
