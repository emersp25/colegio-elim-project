package com.colegio.elim.controller;

import com.colegio.elim.model.dto.dashboard.AdminDashboardDTO;
import com.colegio.elim.model.dto.dashboard.AlumnoDashboardDTO;
import com.colegio.elim.model.dto.dashboard.ProfesorDashboardDTO;
import com.colegio.elim.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // Si prefieres mantener un único endpoint dinámico:
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> dashboard(Authentication auth) {
        var roles = auth.getAuthorities().stream().map(a -> a.getAuthority()).toList();
        var username = auth.getName();

        if (roles.contains("ROLE_ADMIN")) {
            AdminDashboardDTO dto = dashboardService.admin();
            return ResponseEntity.ok(dto);
        }
        if (roles.contains("ROLE_PROF")) { // <- corregido: ROLE_PROF
            ProfesorDashboardDTO dto = dashboardService.profesor(username);
            return ResponseEntity.ok(dto);
        }
        // Por defecto: ALUMNO (ROLE_ALUM)
        AlumnoDashboardDTO dto = dashboardService.alumno(username);
        return ResponseEntity.ok(dto);
    }

    // (Opcional) Endpoints separados si los usas en frontend:
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDTO> admin() {
        return ResponseEntity.ok(dashboardService.admin());
    }

    @GetMapping("/profesor")
    @PreAuthorize("hasRole('PROF')")
    public ResponseEntity<ProfesorDashboardDTO> prof(Authentication auth) {
        return ResponseEntity.ok(dashboardService.profesor(auth.getName()));
    }

    @GetMapping("/alumno")
    @PreAuthorize("hasRole('ALUM')")
    public ResponseEntity<AlumnoDashboardDTO> alumno(Authentication auth) {
        return ResponseEntity.ok(dashboardService.alumno(auth.getName()));
    }
}
