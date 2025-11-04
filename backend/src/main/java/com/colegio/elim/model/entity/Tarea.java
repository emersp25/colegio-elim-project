package com.colegio.elim.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tareas")
public class Tarea {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="curso_id")
    private Curso curso;

    @Column(nullable=false, length=120)
    private String titulo;

    @Column(length=1000)
    private String descripcion;

    @Column(nullable=false)
    private Integer puntosTotales;

    private LocalDateTime fechaEntrega; // fecha límite (opcional)

    public Long getId() { return id; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getPuntosTotales() { return puntosTotales; }
    public void setPuntosTotales(Integer puntosTotales) { this.puntosTotales = puntosTotales; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
}
