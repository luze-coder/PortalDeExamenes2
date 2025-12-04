import Swal from 'sweetalert2';
import { CategoriaService } from './../../../services/categoria.service';
import { ExamenService } from './../../../services/examen.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-actualizar-examen',
  templateUrl: './actualizar-examen.component.html',
  styleUrls: ['./actualizar-examen.component.css']
})
export class ActualizarExamenComponent implements OnInit {

  examenId = 0;

  estadosExamen = [
    { valor: 0, nombre: 'No publicado' },
    { valor: 1, nombre: 'Público' },
    { valor: 2, nombre: 'Restringido' }
  ];

  examen: any = {
    titulo: '',
    descripcion: '',
    puntosMaximos: '',
    numeroDePreguntas: '',
    puntosAprobacion: '',
    tipoHabilitacion: 0,
    categoria: {
      categoriaId: ''
    },
    usuario: {
      id: ''
    }
  };

  categorias: any = [];


  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private categoriaService: CategoriaService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {

    this.examenId = this.route.snapshot.params['examenId'];

    // cargar examen
    this.examenService.obtenerExamen(this.examenId).subscribe(
      (data) => {
        this.examen = data;

        // Asegurar usuario.id
        const user = this.loginService.getUser();

        if (!this.examen.usuario || !this.examen.usuario.id) {
          this.examen.usuario = { id: user.id };
        }

        console.log("Examen cargado:", this.examen);
      },
      (error) => {
        console.log(error);
      }
    );

    const user = this.loginService.getUser();

    // cargar categorías
    this.categoriaService.listarCategoriasPorUsuario(user.id).subscribe(
      (data: any) => {
        this.categorias = data;
      },
      (error) => {
        Swal.fire('Error', 'Error al cargar las categorías', 'error');
      }
    );
  }

  public actualizarDatos() {

    // Reconfirmar usuario (evitar errores)
    const user = this.loginService.getUser();
    this.examen.usuario = { id: user.id };

    this.examenService.actualizarExamen(this.examen).subscribe(
      (data) => {
        Swal.fire(
          'Examen actualizado',
          'El examen ha sido actualizado con éxito',
          'success'
        ).then(() => {
          this.router.navigate(['/admin/examenes']);
        });
      },
      (error) => {
        Swal.fire('Error', 'No se ha podido actualizar el examen', 'error');
        console.log(error);
      }
    );
  }
}

