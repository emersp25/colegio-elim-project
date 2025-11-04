package com.colegio.elim.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "grados")
public class Grado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=80)
    private String nombre;   // Ej: "1ro Primaria A"

    @Column(nullable=false, length=40)
    private String nivel;    // Ej: "Primaria", "Pre-primaria", "Básicos", "Diversificado"

    @Column(nullable=false)
    private Integer anio;    // Ej: 2025

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
}
