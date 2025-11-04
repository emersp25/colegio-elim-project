package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Nota;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    // ========= LISTADOS QUE USA TU NotaController =========

    // ADMIN: puede filtrar por alumno y curso
    @Query("""
        select n
        from Nota n
        where (:alumnoUsername is null or n.alumno.username = :alumnoUsername)
          and (:cursoId is null or n.curso.id = :cursoId)
    """)
    Page<Nota> searchAdmin(@Param("alumnoUsername") String alumnoUsername,
                           @Param("cursoId") Long cursoId,
                           Pageable pageable);

    // PROFESOR: solo notas de sus cursos
    @Query("""
        select n
        from Nota n
        where n.curso.profesor.username = :profesorUsername
          and (:alumnoUsername is null or n.alumno.username = :alumnoUsername)
          and (:cursoId is null or n.curso.id = :cursoId)
    """)
    Page<Nota> searchByProfesor(@Param("profesorUsername") String profesorUsername,
                                @Param("alumnoUsername") String alumnoUsername,
                                @Param("cursoId") Long cursoId,
                                Pageable pageable);

    // ALUMNO: solo sus notas
    @Query("""
        select n
        from Nota n
        where n.alumno.username = :alumnoUsername
          and (:cursoId is null or n.curso.id = :cursoId)
    """)
    Page<Nota> searchByAlumno(@Param("alumnoUsername") String alumnoUsername,
                              @Param("cursoId") Long cursoId,
                              Pageable pageable);

    // ========= MÉTODOS QUE TE ESTÁ PIDIENDO DashboardService =========

    // promedio de todas las notas
    @Query("select avg(n.nota) from Nota n")
    Double promedioGlobal();

    // promedio de las notas de los cursos de un profesor
    @Query("""
        select avg(n.nota)
        from Nota n
        where n.curso.profesor.username = :profesorUsername
    """)
    Double promedioDeProfesor(@Param("profesorUsername") String profesorUsername);

    // promedio de las notas de un alumno
    @Query("""
        select avg(n.nota)
        from Nota n
        where n.alumno.username = :alumnoUsername
    """)
    Double promedioDeAlumno(@Param("alumnoUsername") String alumnoUsername);
}
