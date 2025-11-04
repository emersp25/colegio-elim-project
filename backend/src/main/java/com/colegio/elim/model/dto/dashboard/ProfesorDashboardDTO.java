// ProfesorDashboardDTO.java
package com.colegio.elim.model.dto.dashboard;

import java.util.List;

public record ProfesorDashboardDTO(
        long misCursos,
        long alumnosEnMisCursos,
        Double promedioMisNotas,
        List<TopCursoDTO> topMisCursos
) {}
