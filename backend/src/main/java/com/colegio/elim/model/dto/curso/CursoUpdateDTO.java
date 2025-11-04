package com.colegio.elim.model.dto.curso;

import jakarta.validation.constraints.Size;

public class CursoUpdateDTO {
    @Size(max = 120)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    private Integer anio;
    private Long gradoId;

    // Solo ADMIN puede cambiar el profesor
    private String profesorUsername;

    private Boolean activo;

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
