package com.colegio.elim.controller;

import com.colegio.elim.model.dto.EntregaCreateDTO;
import com.colegio.elim.model.dto.TareaCreateDTO;
import com.colegio.elim.model.dto.TareaUpdateDTO;
import com.colegio.elim.model.entity.*;
import com.colegio.elim.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaRepository tareaRepo;
    private final CursoRepository cursoRepo;
    private final UsuarioRepository usuarioRepo;
    private final InscripcionRepository inscripcionRepo;
    private final EntregaRepository entregaRepo;

    public TareaController(TareaRepository tareaRepo, CursoRepository cursoRepo, UsuarioRepository usuarioRepo,
                           InscripcionRepository inscripcionRepo, EntregaRepository entregaRepo) {
        this.tareaRepo = tareaRepo; this.cursoRepo = cursoRepo; this.usuarioRepo = usuarioRepo;
        this.inscripcionRepo = inscripcionRepo; this.entregaRepo = entregaRepo;
    }

    @GetMapping("/curso/{cursoId}")
    public List<Tarea> porCurso(@PathVariable Long cursoId) {
        return tareaRepo.findByCurso_Id(cursoId);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody TareaCreateDTO body) {
        if (body.cursoId() == null || body.titulo() == null || body.puntosTotales() == null) {
            return ResponseEntity.badRequest().body("cursoId, titulo y puntosTotales son requeridos");
        }
        Curso curso = cursoRepo.findById(body.cursoId()).orElse(null);
        if (curso == null) return ResponseEntity.badRequest().body("cursoId inválido");

        Tarea t = new Tarea();
        t.setCurso(curso);
        t.setTitulo(body.titulo());
        t.setDescripcion(body.descripcion());
        t.setPuntosTotales(body.puntosTotales());
        t.setFechaEntrega(body.fechaEntrega());
        tareaRepo.save(t);
        return ResponseEntity.ok(t);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody TareaUpdateDTO body) {
        return tareaRepo.findById(id).map(t -> {
            if (body.titulo() != null) t.setTitulo(body.titulo());
            if (body.descripcion() != null) t.setDescripcion(body.descripcion());
            if (body.puntosTotales() != null) t.setPuntosTotales(body.puntosTotales());
            if (body.fechaEntrega() != null) t.setFechaEntrega(body.fechaEntrega());
            if (body.cursoId() != null) {
                Curso curso = cursoRepo.findById(body.cursoId()).orElse(null);
                if (curso == null) return ResponseEntity.badRequest().body("cursoId inválido");
                t.setCurso(curso);
            }
            tareaRepo.save(t);
            return ResponseEntity.ok(t);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!tareaRepo.existsById(id)) return ResponseEntity.notFound().build();
        tareaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Alumno entrega tarea
    @PostMapping("/{id}/entregar")
    public ResponseEntity<?> entregar(@PathVariable Long id, @RequestBody EntregaCreateDTO body) {
        Tarea tarea = tareaRepo.findById(id).orElse(null);
        if (tarea == null) return ResponseEntity.notFound().build();

        if (body.alumnoId() == null || body.contenido() == null || body.contenido().isBlank()) {
            return ResponseEntity.badRequest().body("alumnoId y contenido son requeridos");
        }

        Usuario alumno = usuarioRepo.findById(body.alumnoId()).orElse(null);
        if (alumno == null) return ResponseEntity.badRequest().body("alumnoId inválido");
        if (!"ALUMNO".equalsIgnoreCase(alumno.getRol().getNombre()))
            return ResponseEntity.badRequest().body("el usuario indicado no es ALUMNO");

        // Debe estar inscrito en el curso
        if (inscripcionRepo.findByAlumno_IdAndCurso_Id(alumno.getId(), tarea.getCurso().getId()).isEmpty()) {
            return ResponseEntity.badRequest().body("el alumno no está inscrito en este curso");
        }

        // Evita duplicado
        if (entregaRepo.findByTarea_IdAndAlumno_Id(tarea.getId(), alumno.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("esta tarea ya fue entregada por este alumno");
        }

        Entrega e = new Entrega();
        e.setTarea(tarea);
        e.setAlumno(alumno);
        e.setContenido(body.contenido());
        entregaRepo.save(e);

        return ResponseEntity.ok(e);
    }

    // Tareas del alumno (por cursos en los que está inscrito)
    @GetMapping("/mis-tareas")
    public ResponseEntity<?> misTareas(@RequestParam Long alumnoId) {
        var inscripciones = inscripcionRepo.findByAlumno_Id(alumnoId);
        if (inscripciones.isEmpty()) return ResponseEntity.ok(List.of());

        var cursoIds = inscripciones.stream().map(i -> i.getCurso().getId()).collect(Collectors.toList());
        var tareas = tareaRepo.findByCurso_IdIn(cursoIds);

        // (opcional) marcar si ya entregó
        var entregas = entregaRepo.findByAlumno_Id(alumnoId);
        Set<Long> entregadas = entregas.stream().map(e -> e.getTarea().getId()).collect(Collectors.toSet());

        // devolvemos un mapa sencillo { tarea, entregada }
        var resp = tareas.stream().map(t -> Map.of(
                "id", t.getId(),
                "titulo", t.getTitulo(),
                "cursoId", t.getCurso().getId(),
                "fechaEntrega", t.getFechaEntrega(),
                "puntosTotales", t.getPuntosTotales(),
                "entregada", entregadas.contains(t.getId())
        )).toList();

        return ResponseEntity.ok(resp);
    }
}
