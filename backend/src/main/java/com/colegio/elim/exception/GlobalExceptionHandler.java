package com.colegio.elim.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req){
        List<ApiError.FieldErrorItem> fields = ex.getBindingResult().getFieldErrors()
                .stream().map(f -> new ApiError.FieldErrorItem(f.getField(), f.getDefaultMessage())).toList();
        ApiError body = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request",
                "Errores de validación", req.getRequestURI(), fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(EntityNotFoundException ex, HttpServletRequest req){
        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "Not Found",
                ex.getMessage(), req.getRequestURI(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleDenied(AccessDeniedException ex, HttpServletRequest req){
        ApiError body = new ApiError(HttpStatus.FORBIDDEN.value(), "Forbidden",
                "No tienes permisos para esta acción", req.getRequestURI(), null);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegal(IllegalArgumentException ex, HttpServletRequest req){
        ApiError body = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request",
                ex.getMessage(), req.getRequestURI(), null);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req){
        ApiError body = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
                ex.getMessage(), req.getRequestURI(), null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
