package com.colegio.elim.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(columnNames = "nombre"))
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=30)
    private String nombre; // ADMIN, PROFESOR, ALUMNO

    public Rol() {}
    public Rol(String nombre) { this.nombre = nombre; }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
