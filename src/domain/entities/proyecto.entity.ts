
export class ProyectoEntity {
  constructor(
    public id: string,
    public nombre_proyecto: string,
    public descripcion: string,
    public cliente: string,
    public fecha_inicio: Date,
  ){}
}  