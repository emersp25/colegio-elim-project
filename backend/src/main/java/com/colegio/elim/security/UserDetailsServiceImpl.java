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

        // nombre de rol en BD: ADMIN / PROFESOR / ALUMNO
        String roleName = u.getRol().getNombre().toUpperCase();

        return User.withUsername(u.getUsername())
                .password(u.getPassword())
                // IMPORTANTÍSIMO: Spring espera ROLE_ADMIN cuando usas hasRole('ADMIN')
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + roleName)))
                .accountLocked(!u.getActivo())
                .disabled(!u.getActivo())
                .build();
    }
}
