export class ActividadEntity {
  constructor(
    public id: string,
    public accion: string,
    public tituloArticulo: string,
    public responsable: string,
    public fecha: Date,
    public proyectoId: string,
    public articuloId: string | null,
  ) {}
}
