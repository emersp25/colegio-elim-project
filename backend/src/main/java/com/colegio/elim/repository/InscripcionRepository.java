package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Inscripcion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    Long countByCurso_IdAndEstado(Long cursoId, String estado);
    boolean existsByCurso_IdAndAlumno_Username(Long cursoId, String username);

    List<Inscripcion> findByAlumno_Id(Long alumnoId);
    List<Inscripcion> findByCurso_Id(Long cursoId);
    Optional<Inscripcion> findByAlumno_IdAndCurso_Id(Long alumnoId, Long cursoId);

    @Query("select count(i) from Inscripcion i")
    long totalInscripciones();

    @Query("select count(distinct i.alumno.id) from Inscripcion i where i.curso.profesor.username = :username")
    long alumnosEnCursosDeProfesor(String username);

    @Query("select count(i) from Inscripcion i where i.alumno.username = :username")
    long cursosInscritosDeAlumno(String username);

    @Query("""
       select count(i) from Inscripcion i
       where i.alumno.username = :username
         and not exists (
           select 1 from Nota n
           where n.curso = i.curso and n.alumno = i.alumno
         )
       """)
    long pendientesDelAlumno(String username);

    // ---- NUEVO: listados con filtros y paginación ----
    @Query("""
       select i from Inscripcion i
       where (:alumnoUsername is null or :alumnoUsername = '' 
              or lower(i.alumno.username) like lower(concat('%', :alumnoUsername, '%')))
         and (:cursoId is null or i.curso.id = :cursoId)
         and (:estado is null or :estado = '' or upper(i.estado) = upper(:estado))
       """)
    Page<Inscripcion> searchAdmin(String alumnoUsername, Long cursoId, String estado, Pageable pageable);

    @Query("""
       select i from Inscripcion i
       where i.curso.profesor.username = :profUsername
         and (:alumnoUsername is null or :alumnoUsername = '' 
              or lower(i.alumno.username) like lower(concat('%', :alumnoUsername, '%')))
         and (:cursoId is null or i.curso.id = :cursoId)
         and (:estado is null or :estado = '' or upper(i.estado) = upper(:estado))
       """)
    Page<Inscripcion> searchByProfesor(String profUsername, String alumnoUsername, Long cursoId, String estado, Pageable pageable);

    @Query("""
       select i from Inscripcion i
       where i.alumno.username = :alumnoUsername
         and (:cursoId is null or i.curso.id = :cursoId)
         and (:estado is null or :estado = '' or upper(i.estado) = upper(:estado))
       """)
    Page<Inscripcion> searchByAlumno(String alumnoUsername, Long cursoId, String estado, Pageable pageable);
}
