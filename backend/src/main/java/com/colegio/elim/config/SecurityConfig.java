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

                // Contacto: POST público; el resto solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()
                .requestMatchers("/api/contacto/**").hasAuthority("ADMIN")

                // Dashboards por rol (usando lo que está en la BD)
                .requestMatchers("/api/dashboard/admin").hasAuthority("ADMIN")
                .requestMatchers("/api/dashboard/profesor").hasAuthority("PROFESOR")
                .requestMatchers("/api/dashboard/alumno").hasAuthority("ALUMNO")

                // Usuarios: solo ADMIN
                .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")

                // Todo lo demás autenticado
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
