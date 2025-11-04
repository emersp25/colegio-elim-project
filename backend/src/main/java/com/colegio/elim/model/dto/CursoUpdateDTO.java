package com.colegio.elim.model.dto;

public record CursoUpdateDTO(
        String nombre,
        String descripcion,
        Integer anio,
        Long gradoId,
        Long profesorId,
        Boolean activo
) { }
