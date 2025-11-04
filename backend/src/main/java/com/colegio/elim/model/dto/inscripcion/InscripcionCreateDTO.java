package com.colegio.elim.model.dto.inscripcion;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class InscripcionCreateDTO {
    @NotNull private Long cursoId;
    // Para ADMIN/PROF (inscribir a otro): usar alumnoUsername
    @Size(max=60) private String alumnoUsername;

    public Long getCursoId() { return cursoId; }
    public void setCursoId(Long cursoId) { this.cursoId = cursoId; }

    public String getAlumnoUsername() { return alumnoUsername; }
    public void setAlumnoUsername(String alumnoUsername) { this.alumnoUsername = alumnoUsername; }
}
