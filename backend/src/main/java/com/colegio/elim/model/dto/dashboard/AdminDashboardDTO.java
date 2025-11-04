// AdminDashboardDTO.java
package com.colegio.elim.model.dto.dashboard;

import java.util.List;

public record AdminDashboardDTO(
        long totalUsuarios,
        long totalCursos,
        long totalInscripciones,
        Double promedioNotasGlobal,
        List<TopCursoDTO> topCursos
) {}
