package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Entrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    // entregas de una tarea
    List<Entrega> findByTarea_Id(Long tareaId);

    // entregas de tareas de un profesor
    @Query("""
       select e from Entrega e
       where e.tarea.curso.profesor.username = :profUsername
       """)
    List<Entrega> findByProfesor(String profUsername);

    // una entrega puntual del alumno sobre la tarea
    boolean existsByTarea_IdAndAlumno_Username(Long tareaId, String username);
}
