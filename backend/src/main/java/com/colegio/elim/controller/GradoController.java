package com.colegio.elim.controller;

import com.colegio.elim.model.dto.GradoCreateUpdateDTO;
import com.colegio.elim.model.entity.Grado;
import com.colegio.elim.repository.GradoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grados")
@CrossOrigin(origins = "*")
public class GradoController {

    private final GradoRepository repo;
    public GradoController(GradoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Grado> list() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Grado> getOne(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody GradoCreateUpdateDTO body) {
        if (body.nombre() == null || body.nivel() == null || body.anio() == null) {
            return ResponseEntity.badRequest().body("nombre, nivel y anio son requeridos");
        }
        Grado g = new Grado();
        g.setNombre(body.nombre());
        g.setNivel(body.nivel());
        g.setAnio(body.anio());
        repo.save(g);
        return ResponseEntity.ok(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody GradoCreateUpdateDTO body) {
        return repo.findById(id).map(g -> {
            if (body.nombre() != null) g.setNombre(body.nombre());
            if (body.nivel() != null) g.setNivel(body.nivel());
            if (body.anio() != null) g.setAnio(body.anio());
            repo.save(g);
            return ResponseEntity.ok(g);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
