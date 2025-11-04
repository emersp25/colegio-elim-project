package com.colegio.elim.model.dto;

public record CursoCreateDTO(
        String nombre,
        String descripcion,
        Integer anio,
        Long gradoId,
        Long profesorId,
        Boolean activo
) { }
