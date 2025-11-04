package com.colegio.elim.model.dto.nota;

import java.time.LocalDateTime;

public record NotaListDTO(
        Long id,
        Long cursoId,
        String cursoNombre,
        String alumnoUsername,
        String alumnoNombreCompleto,
        Integer nota,
        String tipo,
        String comentario,
        LocalDateTime fechaRegistro
) {}
