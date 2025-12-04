package com.sistema.examenes.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.ExamenAlumno;
import com.sistema.examenes.modelo.Usuario;

public interface ExamenAlumnoRepository extends JpaRepository<ExamenAlumno, Long> {
    List<ExamenAlumno> findByUsuario(Usuario usuario);
    List<ExamenAlumno> findByExamen(Examen examen);
}

