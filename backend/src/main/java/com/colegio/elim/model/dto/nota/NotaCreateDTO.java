package com.colegio.elim.model.dto.nota;

import jakarta.validation.constraints.*;

public class NotaCreateDTO {
    @NotNull private Long cursoId;
    @NotBlank private String alumnoUsername;
    @NotNull @Min(0) @Max(100) private Integer nota;

    @Size(max=30) private String tipo;        // opcional
    @Size(max=300) private String comentario; // opcional

    public Long getCursoId() { return cursoId; }
    public void setCursoId(Long cursoId) { this.cursoId = cursoId; }
    public String getAlumnoUsername() { return alumnoUsername; }
    public void setAlumnoUsername(String alumnoUsername) { this.alumnoUsername = alumnoUsername; }
    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
