package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Entrega;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {
    Optional<Entrega> findByTarea_IdAndAlumno_Id(Long tareaId, Long alumnoId);
    List<Entrega> findByTarea_Id(Long tareaId);
    List<Entrega> findByAlumno_Id(Long alumnoId);
}
