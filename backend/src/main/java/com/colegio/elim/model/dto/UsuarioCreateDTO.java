package com.colegio.elim.model.dto;

public record UsuarioCreateDTO(
        String username,
        String email,
        String nombre,
        String apellido,
        String password,
        String rolNombre
) {}
