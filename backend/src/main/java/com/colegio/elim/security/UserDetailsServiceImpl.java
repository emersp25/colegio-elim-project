package com.colegio.elim.security;

import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository repo;

    public UserDetailsServiceImpl(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 👉 usar el nombre del rol tal cual está en la BD: ADMIN, PROFESOR, ALUMNO
        String authority = u.getRol().getNombre().toUpperCase(); // por si acaso

        return User.withUsername(u.getUsername())
                .password(u.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(authority)))
                // si en tu tabla "activo" = true significa que SÍ puede entrar:
                .accountLocked(!u.getActivo())
                .disabled(!u.getActivo())
                .build();
    }
}
