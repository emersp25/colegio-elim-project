package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // tareas de un curso
    List<Tarea> findByCurso_Id(Long cursoId);

    // tareas de cursos de un profesor
    @Query("""
        select t from Tarea t
        where t.curso.profesor.username = :profUsername
        order by t.id desc
        """)
    List<Tarea> findByProfesor(String profUsername);
}
