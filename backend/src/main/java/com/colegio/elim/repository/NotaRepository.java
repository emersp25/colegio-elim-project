package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Nota;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    // Promedios
    @Query("select avg(n.nota) from Nota n")
    Double promedioGlobal();

    @Query("select avg(n.nota) from Nota n where n.curso.profesor.username = :username")
    Double promedioDeProfesor(String username);

    @Query("select avg(n.nota) from Nota n where n.alumno.username = :username")
    Double promedioDeAlumno(String username);

    // Listado ADMIN (filtros opcionales)
    @Query("""
           select n from Nota n
           where (:alumnoUsername is null or :alumnoUsername = '' or lower(n.alumno.username) like lower(concat('%', :alumnoUsername, '%')))
             and (:cursoId is null or n.curso.id = :cursoId)
           """)
    Page<Nota> searchAdmin(String alumnoUsername, Long cursoId, Pageable pageable);

    // Listado PROF (limitado a sus cursos)
    @Query("""
           select n from Nota n
           where n.curso.profesor.username = :profUsername
             and (:alumnoUsername is null or :alumnoUsername = '' or lower(n.alumno.username) like lower(concat('%', :alumnoUsername, '%')))
             and (:cursoId is null or n.curso.id = :cursoId)
           """)
    Page<Nota> searchByProfesor(String profUsername, String alumnoUsername, Long cursoId, Pageable pageable);

    // Listado ALUM (sus propias notas)
    @Query("""
           select n from Nota n
           where n.alumno.username = :alumnoUsername
             and (:cursoId is null or n.curso.id = :cursoId)
           """)
    Page<Nota> searchByAlumno(String alumnoUsername, Long cursoId, Pageable pageable);
}
