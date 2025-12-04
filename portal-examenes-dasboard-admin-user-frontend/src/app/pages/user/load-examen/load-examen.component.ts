import { ExamenService } from './../../../services/examen.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SolicitudExamenService } from 'src/app/services/solicitudexamen.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-load-examen',
  templateUrl: './load-examen.component.html',
  styleUrls: ['./load-examen.component.css']
})
export class LoadExamenComponent implements OnInit {

  catId: any = 0;
  examenes: any[] = [];

  // Estado recibido desde el backend
  habilitados: {
    [key: number]: {
      puedeEnviar: boolean;
      pendiente: boolean;
      habilitado: boolean;
      rechazada: boolean,
    }
  } = {};


  // Nuevo: indica si está consultando al backend
  habilitadosCargando: { [key: number]: boolean } = {};

  estadosExamen = [
    { valor: 0, nombre: 'No publicado' },
    { valor: 1, nombre: 'Público' },
    { valor: 2, nombre: 'Restringido' }
  ];

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private solicitudService: SolicitudExamenService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.catId = params['catId'];
      this.cargarExamenes();
    });
  }


  cargarExamenes() {

    const user = this.loginService.getUser();

    const alumnoId = Number(user.id);

    this.habilitados = {};

    this.examenService.obtenerPublicadosYRestringidosDeUnaCategoria(this.catId)
      .subscribe(
        (data: any) => {
          this.examenes = data;

          // Esperamos 150 ms para dejar que Angular renderice la lista
          setTimeout(() => {
            this.examenes.forEach(e => {
              if (e.tipoHabilitacion === 2) {
                this.solicitudService.estaHabilitado(e.examenId, alumnoId)
                  .subscribe((resp: any) => {

                    const estado = resp.estado;

                    this.habilitados[e.examenId] = {
                      puedeEnviar: estado === "NULO",
                      pendiente: estado === "PENDIENTE",
                      habilitado: estado === "ACEPTADA",
                      rechazada: estado === "RECHAZADA"
                    };

                  });

              }
            });
          }, 150);
        },
        (error) => console.log(error)
      );

  }



  solicitarAcceso(examenId: number) {


    this.solicitudService.enviarSolicitud(examenId).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'El profesor revisará tu solicitud.',
          timer: 2000
        });

        const user = this.loginService.getUser();
        const alumnoId = Number(user.id);

        // Volvemos a preguntar al backend por si ya existe una solicitud previa o aprobada
        this.solicitudService.estaHabilitado(examenId, alumnoId).subscribe(
          (resp: any) => {
            const estado = resp.estado;

            this.habilitados[examenId] = {
              puedeEnviar: estado === "NULO",
              pendiente: estado === "PENDIENTE",
              habilitado: estado === "ACEPTADA",
              rechazada: estado === "RECHAZADA"
            };
          }
        );

      },
      (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Ya enviaste una solicitud',
          text: 'Debes esperar la respuesta del profesor.'
        });
      }
    );
  }

  getNombreEstado(tipo: number): string {
    const estado = this.estadosExamen.find(est => est.valor === tipo);
    return estado ? estado.nombre : 'Desconocido';
  }
}
