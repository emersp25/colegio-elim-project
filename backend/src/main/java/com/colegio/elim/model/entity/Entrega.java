package com.colegio.elim.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entregas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tarea_id","alumno_id"}))
public class Entrega {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="tarea_id")
    private Tarea tarea;

    @ManyToOne(optional=false) @JoinColumn(name="alumno_id")
    private Usuario alumno; // Usuario con rol ALUMNO

    @Column(nullable=false, length=4000)
    private String contenido; // enlace, texto o referencia

    @Column(nullable=false)
    private LocalDateTime fechaEntrega = LocalDateTime.now(); // momento de envío

    private Integer calificacion;    // opcional
    private String observaciones;    // feedback opcional

    public Long getId() { return id; }
    public Tarea getTarea() { return tarea; }
    public void setTarea(Tarea tarea) { this.tarea = tarea; }
    public Usuario getAlumno() { return alumno; }
    public void setAlumno(Usuario alumno) { this.alumno = alumno; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    public Integer getCalificacion() { return calificacion; }
    public void setCalificacion(Integer calificacion) { this.calificacion = calificacion; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
