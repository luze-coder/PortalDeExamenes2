package com.sistema.examenes.servicios.impl;

import com.sistema.examenes.modelo.Categoria;
import com.sistema.examenes.modelo.Examen;
import com.sistema.examenes.modelo.Usuario;
import com.sistema.examenes.repositorios.ExamenRepository;
import com.sistema.examenes.servicios.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class ExamenServiceImpl implements ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    @Override
    public Examen agregarExamen(Examen examen) {
        return examenRepository.save(examen);
    }

    @Override
    public Examen actualizarExamen(Examen examen) {
        return examenRepository.save(examen);
    }

    @Override
    public Set<Examen> obtenerExamenes() {
        return new LinkedHashSet<>(examenRepository.findAll());
    }

    @Override
    public Examen obtenerExamen(Long examenId) {
        return examenRepository.findById(examenId).orElse(null);
    }

    @Override
    public void eliminarExamen(Long examenId) {
        Examen examen = new Examen();
        examen.setExamenId(examenId);
        examenRepository.delete(examen);
    }

    @Override
    public List<Examen> listarExamenesDeUnaCategoria(Categoria categoria) {
        return examenRepository.findByCategoria(categoria);
    }

    @Override
    public List<Examen> obtenerExamenesPublicados() {
        return examenRepository.findByTipoHabilitacion(1); // LIBRE
    }

    @Override
    public List<Examen> obtenerExamenesPublicadosYRestrDeUnaCategoria(Categoria categoria) {
        // Tipos 1 = público, 2 = restringido
        List<Integer> tipos = Arrays.asList(1, 2);
        return examenRepository.findByCategoriaAndTipoHabilitacionIn(categoria, tipos);
    }

    @Override
    public List<Examen> obtenerExamenesDeUsuario(Usuario usuario) {
        return examenRepository.findByUsuario(usuario);
    }

    @Override
    public List<Examen> obtenerExamenesRestringidos() {
        return examenRepository.findByTipoHabilitacion(2); // RESTRINGIDOS
    }
}


