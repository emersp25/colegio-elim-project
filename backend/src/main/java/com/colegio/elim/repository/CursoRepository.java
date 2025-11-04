package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Curso;
import com.colegio.elim.model.dto.dashboard.TopCursoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByActivoTrue();
    List<Curso> findByProfesor_Id(Long profesorId);
    List<Curso> findByGrado_Id(Long gradoId);

    // --- BÚSQUEDA GLOBAL (ADMIN) ---
    @Query("""
       select c from Curso c
       where (:q is null or :q = '' or lower(c.nombre) like lower(concat('%', :q, '%')))
         and (:gradoId is null or c.grado.id = :gradoId)
         and (:activo is null or c.activo = :activo)
       """)
    Page<Curso> search(@Param("q") String q,
                       @Param("gradoId") Long gradoId,
                       @Param("activo") Boolean activo,
                       Pageable pageable);

    // --- BÚSQUEDA PARA PROFESOR (solo sus cursos) ---
    @Query("""
       select c from Curso c
       where c.profesor.username = :username
         and (:q is null or :q = '' or lower(c.nombre) like lower(concat('%', :q, '%')))
         and (:gradoId is null or c.grado.id = :gradoId)
         and (:activo is null or c.activo = :activo)
       """)
    Page<Curso> searchByProfesor(@Param("username") String username,
                                 @Param("q") String q,
                                 @Param("gradoId") Long gradoId,
                                 @Param("activo") Boolean activo,
                                 Pageable pageable);

    // --- BÚSQUEDA PARA ALUMNO (cursos donde está inscrito) ---
    @Query("""
       select c from Curso c
       join Inscripcion i on i.curso = c
       where i.alumno.username = :username
         and (:q is null or :q = '' or lower(c.nombre) like lower(concat('%', :q, '%')))
         and (:gradoId is null or c.grado.id = :gradoId)
         and (:activo is null or c.activo = :activo)
       """)
    Page<Curso> searchByAlumno(@Param("username") String username,
                               @Param("q") String q,
                               @Param("gradoId") Long gradoId,
                               @Param("activo") Boolean activo,
                               Pageable pageable);

    // Ya tenías estos (ajustados a Pageable correcto):
    @Query("""
       select new com.colegio.elim.model.dto.dashboard.TopCursoDTO(
         c.id, c.nombre, count(i)
       )
       from Curso c
       left join Inscripcion i on i.curso = c
       group by c.id, c.nombre
       order by count(i) desc
       """)
    List<TopCursoDTO> topCursos(Pageable pageable);

    long countByProfesorUsername(String username);

    @Query("""
       select new com.colegio.elim.model.dto.dashboard.TopCursoDTO(
         c.id, c.nombre, count(i)
       )
       from Curso c
       left join Inscripcion i on i.curso = c
       where c.profesor.username = :username
       group by c.id, c.nombre
       order by count(i) desc
       """)
    List<TopCursoDTO> topCursosDeProfesor(String username, Pageable pageable);
}
