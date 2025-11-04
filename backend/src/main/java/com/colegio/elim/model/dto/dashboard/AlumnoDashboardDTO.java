// AlumnoDashboardDTO.java
package com.colegio.elim.model.dto.dashboard;

public record AlumnoDashboardDTO(
        long cursosInscritos,
        Double promedioMisNotas,
        long notasPendientes
) {}
