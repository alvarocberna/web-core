export class SecEmpleadoEntity {
  constructor(
    public id: string,
    public nroSeccion: number,
    public tituloSec: string | null,
    public contenidoSec: string | null,
    public imageUrl: string | null,
    public imageAlt: string | null,
    public imagePosition: string | null,
    public proyectoId: string,
    public empleadoId: string,
  ) {}
}
