package com.colegio.elim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ElimApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElimApplication.class, args);
        System.out.println("Aplicación iniciada correctamente.");
	}
}
