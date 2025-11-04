package com.colegio.elim.model.dto;

import jakarta.validation.constraints.*;

public record GradoCreateUpdateDTO(
        @NotBlank @Size(max=80) String nombre,
        @NotBlank @Size(max=40) String nivel,
        @NotNull @Min(2000) @Max(2100) Integer anio
) { }
