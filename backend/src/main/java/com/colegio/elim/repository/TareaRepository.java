package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByCurso_Id(Long cursoId);
    List<Tarea> findByCurso_IdIn(List<Long> cursoIds);
}
