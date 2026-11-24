export class ServicioEntity {
  constructor(
    public id: string,
    public nombreServicio: string,
    public descripcion: string | null,
    public valor: number | null,
    public nombrePromocion: string | null,
    public porcentajeDescuento: number | null,
    public destacado: boolean,
    public icono: string | null,
    public orden: number | null,
    public activo: boolean,
    public slug: string,
    public imgUrl: string | null,
    public imgAlt: string | null,
    public proyectoId: string,
    public serviciosId: string,
  ) {}
}
