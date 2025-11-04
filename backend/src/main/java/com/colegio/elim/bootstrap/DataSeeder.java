package com.colegio.elim.bootstrap;

import com.colegio.elim.model.entity.Rol;
import com.colegio.elim.model.entity.Usuario;
import com.colegio.elim.repository.RolRepository;
import com.colegio.elim.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final RolRepository rolRepo;
    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(RolRepository rolRepo, UsuarioRepository usuarioRepo, PasswordEncoder encoder) {
        this.rolRepo = rolRepo; this.usuarioRepo = usuarioRepo; this.encoder = encoder;
    }

    @Override public void run(String... args) {
        Rol admin = rolRepo.findByNombre("ADMIN").orElseGet(() -> rolRepo.save(new Rol("ADMIN")));
        rolRepo.findByNombre("PROFESOR").orElseGet(() -> rolRepo.save(new Rol("PROFESOR")));
        rolRepo.findByNombre("ALUMNO").orElseGet(() -> rolRepo.save(new Rol("ALUMNO")));

        if (!usuarioRepo.existsByUsername("admin")) {
            Usuario u = new Usuario();
            u.setUsername("admin");
            u.setPassword(encoder.encode("Admin123!"));
            u.setEmail("admin@elim.edu");
            u.setNombre("Admin");
            u.setApellido("Elim");
            u.setRol(admin);
            u.setActivo(true);
            usuarioRepo.save(u);
        }

        // PROFESOR demo
        rolRepo.findByNombre("PROFESOR").orElseGet(() -> rolRepo.save(new Rol("PROFESOR")));
        if (!usuarioRepo.existsByUsername("profe1")) {
            Usuario p = new Usuario();
            p.setUsername("profe1");
            p.setPassword(encoder.encode("Prof123!"));
            p.setEmail("profe1@elim.edu");
            p.setNombre("Profe");
            p.setApellido("Demo");
            p.setRol(rolRepo.findByNombre("PROFESOR").orElseThrow());
            p.setActivo(true);
            usuarioRepo.save(p);
        }

        // ALUMNO demo
        if (!usuarioRepo.existsByUsername("alumno1")) {
            var rolAlumno = rolRepo.findByNombre("ALUMNO").orElseThrow();
            var a = new Usuario();
            a.setUsername("alumno1");
            a.setPassword(encoder.encode("Alu123!"));
            a.setEmail("alumno1@elim.edu");
            a.setNombre("Alumno");
            a.setApellido("Demo");
            a.setRol(rolAlumno);
            a.setActivo(true);
            usuarioRepo.save(a);
        }


    }
}
