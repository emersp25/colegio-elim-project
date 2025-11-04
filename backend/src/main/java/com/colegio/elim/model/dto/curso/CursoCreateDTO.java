package com.colegio.elim.model.dto.curso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CursoCreateDTO {
    @NotBlank @Size(max = 120)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    @NotNull
    private Integer anio;

    @NotNull
    private Long gradoId;

    // Si el creador es PROF, este campo se ignora y se asigna el profesor actual.
    private String profesorUsername;

    private Boolean activo = true;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public Long getGradoId() { return gradoId; }
    public void setGradoId(Long gradoId) { this.gradoId = gradoId; }
    public String getProfesorUsername() { return profesorUsername; }
    public void setProfesorUsername(String profesorUsername) { this.profesorUsername = profesorUsername; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
