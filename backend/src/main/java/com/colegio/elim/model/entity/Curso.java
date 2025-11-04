package com.colegio.elim.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
public class Curso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=120)
    private String nombre;

    @Column(length=500)
    private String descripcion;

    @Column(nullable=false)
    private Integer anio;  // Ej: 2025

    @Column(nullable=false)
    private Boolean activo = true;

    @ManyToOne(optional=false) @JoinColumn(name="grado_id")
    private Grado grado;

    // Tomamos profesor como un Usuario con rol=PROFESOR
    @ManyToOne(optional=false) @JoinColumn(name="profesor_id")
    private Usuario profesor;

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public Grado getGrado() { return grado; }
    public void setGrado(Grado grado) { this.grado = grado; }
    public Usuario getProfesor() { return profesor; }
    public void setProfesor(Usuario profesor) { this.profesor = profesor; }
}
