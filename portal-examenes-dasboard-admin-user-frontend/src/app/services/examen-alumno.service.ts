import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ExamenAlumnoService {

  constructor(private http: HttpClient) { }

  guardarResultado(data: any) {
    return this.http.post(`${baseUrl}/api/examen-alumno/guardar`, data);
  }
}
