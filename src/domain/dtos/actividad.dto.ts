export interface ActividadDto {
  id: string;
  accion: string;
  tituloArticulo: string;
  responsable: string;
  fecha: Date;
  proyectoId: string;
  articuloId: string | null;
}
