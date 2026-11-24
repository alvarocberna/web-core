export class ArticulosEntity {
  constructor(
    public id: string,
    public titulo: string,
    public descripcion: string | null,
    public activo: boolean,
    public aprobar: boolean,
    public notificacion: boolean,
    public habilitado: boolean,
    public proyectoId: string,
  ) {}
}
