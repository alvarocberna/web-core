export class ArticuloEntity {
  constructor(
    public id: string,
    public nroArticulo: number,
    public titulo: string,
    public subtitulo: string | null,
    public autor: string,
    public fechaPublicacion: Date,
    public fechaActualizacion: Date | null,
    public status: string,
    public activo: boolean,
    public slug: string,
    public imageUrl: string | null,
    public imageAlt: string | null,
    public imagePosition: string | null,
    public proyectoId: string,
    public articulosId: string,
  ) {}
}
