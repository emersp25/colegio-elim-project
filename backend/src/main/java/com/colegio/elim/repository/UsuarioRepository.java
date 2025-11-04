package com.colegio.elim.repository;

import com.colegio.elim.model.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // <- IMPORT CORRECTO
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("select count(u) from Usuario u")
    long totalUsuarios();

    @Query("""
       select u from Usuario u
       where (:q is null or :q = '' 
          or lower(u.username) like lower(concat('%', :q, '%'))
          or lower(u.email) like lower(concat('%', :q, '%'))
          or lower(u.nombre) like lower(concat('%', :q, '%'))
          or lower(u.apellido) like lower(concat('%', :q, '%'))
       )
    """)
    Page<Usuario> search(@Param("q") String q, Pageable pageable);
}
