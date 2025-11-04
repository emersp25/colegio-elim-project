package com.colegio.elim.service;

import com.colegio.elim.model.dto.dashboard.AdminDashboardDTO;
import com.colegio.elim.model.dto.dashboard.AlumnoDashboardDTO;
import com.colegio.elim.model.dto.dashboard.ProfesorDashboardDTO;
import com.colegio.elim.repository.CursoRepository;
import com.colegio.elim.repository.InscripcionRepository;
import com.colegio.elim.repository.NotaRepository;
import com.colegio.elim.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioRepository usuarioRepo;
    private final CursoRepository cursoRepo;
    private final InscripcionRepository inscripcionRepo;
    private final NotaRepository notaRepo;

    @Transactional(readOnly = true)
    public AdminDashboardDTO admin() {
        long totalUsuarios = usuarioRepo.totalUsuarios();
        long totalCursos = cursoRepo.count();
        long totalInscripciones = inscripcionRepo.totalInscripciones();
        double promedio = notaRepo.promedioGlobal(); // coalesce en el repo => nunca null
        var top = cursoRepo.topCursos(PageRequest.of(0, 5));
        return new AdminDashboardDTO(totalUsuarios, totalCursos, totalInscripciones, promedio, top);
    }

    @Transactional(readOnly = true)
    public ProfesorDashboardDTO profesor(String username) {
        long misCursos = cursoRepo.countByProfesorUsername(username);
        long alumnosEnMisCursos = inscripcionRepo.alumnosEnCursosDeProfesor(username);
        double promedioMisNotas = notaRepo.promedioDeProfesor(username);
        var top = cursoRepo.topCursosDeProfesor(username, PageRequest.of(0, 5));
        return new ProfesorDashboardDTO(misCursos, alumnosEnMisCursos, promedioMisNotas, top);
    }

    @Transactional(readOnly = true)
    public AlumnoDashboardDTO alumno(String username) {
        long cursosInscritos = inscripcionRepo.cursosInscritosDeAlumno(username);
        double promedio = notaRepo.promedioDeAlumno(username);
        long pendientes = inscripcionRepo.pendientesDelAlumno(username);
        return new AlumnoDashboardDTO(cursosInscritos, promedio, pendientes);
    }
}
