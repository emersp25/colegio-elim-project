package com.colegio.elim.exception;

import java.time.OffsetDateTime;
import java.util.List;

public class ApiError {
    public OffsetDateTime timestamp = OffsetDateTime.now();
    public int status;
    public String error;
    public String message;
    public String path;
    public List<FieldErrorItem> errors;

    public ApiError(int status, String error, String message, String path, List<FieldErrorItem> errors) {
        this.status = status; this.error = error; this.message = message; this.path = path; this.errors = errors;
    }

    public static class FieldErrorItem {
        public String field;
        public String message;
        public FieldErrorItem(String field, String message){ this.field = field; this.message = message; }
    }
}
