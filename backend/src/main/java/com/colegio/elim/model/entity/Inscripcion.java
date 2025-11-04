package com.colegio.elim.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones",
        uniqueConstraints = @UniqueConstraint(columnNames = {"alumno_id","curso_id"}))
public class Inscripcion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="alumno_id")
    private Usuario alumno; // Usuario con rol ALUMNO

    @ManyToOne(optional=false) @JoinColumn(name="curso_id")
    private Curso curso;

    @Column(nullable=false)
    private LocalDateTime fechaInscripcion = LocalDateTime.now();

    @Column(nullable=false, length=20)
    private String estado = "ACTIVA"; // ACTIVA | CANCELADA

    public Long getId() { return id; }
    public Usuario getAlumno() { return alumno; }
    public void setAlumno(Usuario alumno) { this.alumno = alumno; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    public LocalDateTime getFechaInscripcion() { return fechaInscripcion; }
    public void setFechaInscripcion(LocalDateTime fechaInscripcion) { this.fechaInscripcion = fechaInscripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
