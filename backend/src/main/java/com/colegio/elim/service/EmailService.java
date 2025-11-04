package com.colegio.elim.service;

import com.colegio.elim.model.dto.contacto.ContactoRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    // Opcional: configura estos en application.properties
    @Value("${app.mail.to:informacionelim@gmail.com}")
    private String correoDestino;

    @Value("${spring.mail.username:no-reply@colegio-elim.local}")
    private String correoFrom;

    public void enviarContacto(ContactoRequest req){
        try {
            // 1) Variables para el template
            Context ctx = new Context(Locale.getDefault());
            ctx.setVariable("nombre", req.getNombre());
            ctx.setVariable("email", req.getEmail());
            ctx.setVariable("telefono", req.getTelefono()); // puede ser null
            ctx.setVariable("mensaje", req.getMensaje());
            ctx.setVariable("fecha",
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

            // 2) Procesar el template contacto.html -> String html
            String html = templateEngine.process("mail/contacto", ctx);

            // 3) Construir el correo
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mime, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setTo(correoDestino);
            helper.setFrom(correoFrom);
            helper.setReplyTo(req.getEmail()); // así puedes responder directo al remitente
            helper.setSubject("Nuevo contacto desde la plataforma");
            helper.setText(html, true); // <-- aquí va el HTML procesado

            // 4) Enviar
            mailSender.send(mime);
        } catch (Exception e) {
            throw new IllegalArgumentException("No se pudo enviar el correo: " + e.getMessage(), e);
        }
    }
}
