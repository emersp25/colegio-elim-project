package com.colegio.elim.model.dto.nota;

import jakarta.validation.constraints.*;

public class NotaUpdateDTO {
    @Min(0) @Max(100) private Integer nota; // opcional
    @Size(max=30) private String tipo;       // opcional
    @Size(max=300) private String comentario;

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
