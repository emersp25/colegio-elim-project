package com.colegio.elim.model.dto.usuario;

public record UsuarioListDTO(
        Long id,
        String username,
        String nombreCompleto,
        String email,
        String rol
) {}
