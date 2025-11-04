package com.colegio.elim.model.dto.contacto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Payload para /api/contacto y para EmailService.enviarContacto(...)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ContactoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80, message = "El nombre debe tener máximo 80 caracteres")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Size(max = 120, message = "El email debe tener máximo 120 caracteres")
    private String email;

    @Size (max = 25, message = "El teléfono debe tener máximo 25 caracteres")


    @Pattern(
            regexp = "^[+()\\d\\s-]*$",
            message = "El teléfono solo puede contener dígitos, espacios, '+', '-', y paréntesis"
    )
    private String telefono; // opcional

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 1000, message = "El mensaje debe tener máximo 1000 caracteres")
    private String mensaje;
}
