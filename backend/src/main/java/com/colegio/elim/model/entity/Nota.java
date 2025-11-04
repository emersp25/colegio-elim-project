package com.colegio.elim.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas")
public class Nota {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="alumno_id")
    private Usuario alumno;

    @ManyToOne(optional=false) @JoinColumn(name="curso_id")
    private Curso curso;

    @Column(nullable=false)
    private Integer nota; // 0..100

    @Column(length=30)
    private String tipo; // TAREA | EXAMEN | PROYECTO | etc (opcional)

    @Column(length=300)
    private String comentario;

    @Column(nullable=false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Getters/Setters
    public Long getId() { return id; }
    public Usuario getAlumno() { return alumno; }
    public void setAlumno(Usuario alumno) { this.alumno = alumno; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
