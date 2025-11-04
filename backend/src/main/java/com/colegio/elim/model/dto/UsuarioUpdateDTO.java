package com.colegio.elim.model.dto;

public record UsuarioUpdateDTO(
        String email,
        String nombre,
        String apellido,
        String password,
        String rolNombre,
        Boolean activo
) {}
