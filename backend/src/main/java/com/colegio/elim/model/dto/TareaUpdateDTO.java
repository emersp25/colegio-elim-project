package com.colegio.elim.model.dto;

import java.time.LocalDateTime;

public record TareaUpdateDTO(
        String titulo,
        String descripcion,
        Integer puntosTotales,
        Long cursoId,
        LocalDateTime fechaEntrega,
        Boolean activo // ignorado por ahora (no está en Tarea), lo dejamos por compatibilidad futura
) {}
