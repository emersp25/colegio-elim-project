package com.colegio.elim.model.dto.curso;

public record CursoListDTO(
        Long id,
        String nombre,
        String descripcion,
        Integer anio,
        Long gradoId,
        String gradoNombre,
        String profesorUsername,
        Boolean activo,
        Long inscritos
) {}
