export class EmpleadoEntity {
  constructor(
    public id: string,
    public nombrePrimero: string,
    public nombreSegundo: string | null,
    public apellidoPaterno: string,
    public apellidoMaterno: string | null,
    public profesion: string | null,
    public especialidad: string | null,
    public descripcion: string | null,
    public orden: number | null,
    public activo: boolean,
    public slug: string,
    public imgUrl: string | null,
    public imgAlt: string | null,
    public proyectoId: string,
    public equipoId: string,
  ) {}
}
