package com.colegio.elim.model.dto;

import java.time.LocalDateTime;

public record TareaCreateDTO(
        Long cursoId,
        String titulo,
        String descripcion,
        Integer puntosTotales,
        LocalDateTime fechaEntrega
) {}
