package com.colegio.elim.config;

import com.colegio.elim.security.JwtAuthenticationEntryPoint;
import com.colegio.elim.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final JwtAuthenticationEntryPoint jwtEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CORS
        http.cors(cors -> cors.configurationSource(req -> {
            CorsConfiguration c = new CorsConfiguration();
            c.setAllowedOrigins(List.of("*"));
            c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
            c.setAllowedHeaders(List.of("*"));
            c.setAllowCredentials(false);
            return c;
        }));

        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth
                // Swagger / OpenAPI
                .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html").permitAll()

                // Auth + básicos
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/ping", "/error").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Contacto: POST público; lo demás admin
                .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()
                .requestMatchers("/api/contacto/**").hasRole("ADMIN")

                // Dashboards por rol
                .requestMatchers("/api/dashboard/admin").hasRole("ADMIN")
                .requestMatchers("/api/dashboard/profesor").hasRole("PROFESOR")
                .requestMatchers("/api/dashboard/alumno").hasRole("ALUMNO")

                // Usuarios: solo ADMIN
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                // Cursos: admin, profesor y alumno
                .requestMatchers("/api/cursos/**").hasAnyRole("ADMIN","PROFESOR","ALUMNO")

                // Inscripciones: admin, profesor y alumno
                .requestMatchers("/api/inscripciones/**").hasAnyRole("ADMIN","PROFESOR","ALUMNO")

                // Grados: solo admin
                .requestMatchers("/api/grados/**").hasRole("ADMIN")

                // 🔥 NUEVO: tareas (crear/ver) -> admin y profesor, y alumno puede ver/listar las suyas
                .requestMatchers("/api/tareas/**").hasAnyRole("ADMIN","PROFESOR","ALUMNO")

                // 🔥 NUEVO: entregas (alumno entrega, prof califica)
                .requestMatchers("/api/entregas/**").hasAnyRole("ADMIN","PROFESOR","ALUMNO")

                // cualquier otra cosa: autenticado
                .anyRequest().authenticated()
        );

        http.exceptionHandling(ex -> ex.authenticationEntryPoint(jwtEntryPoint));
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
