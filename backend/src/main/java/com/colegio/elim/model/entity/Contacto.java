package com.colegio.elim.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="contactos")
public class Contacto {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String nombre;
    @Column(nullable=false) private String email;
    private String telefono;
    @Column(nullable=false, length=2000) private String mensaje;
    @Column(nullable=false) private LocalDateTime fecha = LocalDateTime.now();
    @Column(nullable=false) private Boolean atendido = false;

    public Long getId(){return id;}
    public String getNombre(){return nombre;}
    public void setNombre(String nombre){this.nombre=nombre;}
    public String getEmail(){return email;}
    public void setEmail(String email){this.email=email;}
    public String getTelefono(){return telefono;}
    public void setTelefono(String telefono){this.telefono=telefono;}
    public String getMensaje(){return mensaje;}
    public void setMensaje(String mensaje){this.mensaje=mensaje;}
    public LocalDateTime getFecha(){return fecha;}
    public void setFecha(LocalDateTime fecha){this.fecha=fecha;}
    public Boolean getAtendido(){return atendido;}
    public void setAtendido(Boolean atendido){this.atendido=atendido;}
}
