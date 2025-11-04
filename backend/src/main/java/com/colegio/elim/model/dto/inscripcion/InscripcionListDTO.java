package com.colegio.elim.model.dto.inscripcion;

import java.time.LocalDateTime;

public record InscripcionListDTO(
        Long id,
        Long cursoId,
        String cursoNombre,
        String alumnoUsername,
        String alumnoNombreCompleto,
        String estado,
        LocalDateTime fechaInscripcion
) {}
