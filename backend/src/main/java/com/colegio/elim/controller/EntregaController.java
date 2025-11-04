package com.colegio.elim.controller;

import com.colegio.elim.model.dto.EntregaCalificarDTO;
import com.colegio.elim.model.entity.Entrega;
import com.colegio.elim.repository.EntregaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entregas")
@CrossOrigin(origins = "*")
public class EntregaController {

    private final EntregaRepository repo;

    public EntregaController(EntregaRepository repo) { this.repo = repo; }

    @GetMapping("/tarea/{tareaId}")
    public List<Entrega> porTarea(@PathVariable Long tareaId) {
        return repo.findByTarea_Id(tareaId);
    }

    @GetMapping("/alumno/{alumnoId}")
    public List<Entrega> porAlumno(@PathVariable Long alumnoId) {
        return repo.findByAlumno_Id(alumnoId);
    }

    @PutMapping("/{id}/calificar")
    public ResponseEntity<?> calificar(@PathVariable Long id, @RequestBody EntregaCalificarDTO body) {
        return repo.findById(id).map(e -> {
            e.setCalificacion(body.calificacion());
            e.setObservaciones(body.observaciones());
            repo.save(e);
            return ResponseEntity.ok(e);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entrega> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
