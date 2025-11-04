package com.colegio.elim.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="usuarios",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class Usuario {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=50)
    private String username;

    @JsonIgnore
    @Column(nullable=false, length=120)
    private String password;

    @Column(nullable=false, length=120)
    private String email;

    @Column(nullable=false, length=80)
    private String nombre;

    @Column(nullable=false, length=80)
    private String apellido;

    @ManyToOne(optional=false) @JoinColumn(name="rol_id")
    private Rol rol;

    @Column(nullable=false)
    private Boolean activo = true;

    @Column(nullable=false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Usuario() {}

    // Getters/Setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
