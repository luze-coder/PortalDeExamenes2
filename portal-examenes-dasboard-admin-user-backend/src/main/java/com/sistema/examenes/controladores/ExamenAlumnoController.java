package com.sistema.examenes.controladores;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.servicios.ExamenAlumnoService;
import com.sistema.examenes.servicios.ExamenService;
import com.sistema.examenes.servicios.UsuarioService;

@RestController
@RequestMapping("/api/examen-alumno")
@CrossOrigin("*")
public class ExamenAlumnoController {

    @Autowired
    private ExamenAlumnoService examenAlumnoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ExamenService examenService;

    // Guardar resultado del examen
    @PostMapping("/guardar")
    public ResponseEntity<ExamenAlumno> guardarResultado(@RequestBody Map<String, Object> data) {

        Long alumnoId = Long.valueOf(data.get("alumnoId").toString());
        Long examenId = Long.valueOf(data.get("examenId").toString());
        Double nota = Double.valueOf(data.get("nota").toString());

        Usuario alumno = usuarioService.obtenerUsuarioPorId(alumnoId);
        Examen examen = examenService.obtenerExamen(examenId);

        ExamenAlumno ea = new ExamenAlumno();
        ea.setUsuario(alumno);
        ea.setExamen(examen);
        ea.setNotaObtenida(nota);
        ea.setHabilitado(true);
        ea.setRealizado(true);
        ea.setFechaRealizacion(LocalDateTime.now().toString());

        ExamenAlumno guardado = examenAlumnoService.guardar(ea);

        return ResponseEntity.ok(guardado);
    }

    // Listar exámenes hechos por un alumno
    @GetMapping("/alumno/{id}")
    public ResponseEntity<List<ExamenAlumno>> listarPorAlumno(@PathVariable Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return ResponseEntity.ok(examenAlumnoService.listarPorAlumno(u));
    }

    // Listar alumnos que hicieron un examen
    @GetMapping("/examen/{id}")
    public ResponseEntity<List<ExamenAlumno>> listarPorExamen(@PathVariable Long id) {
        Examen e = new Examen();
        e.setExamenId(id);
        return ResponseEntity.ok(examenAlumnoService.listarPorExamen(e));
    }
}
