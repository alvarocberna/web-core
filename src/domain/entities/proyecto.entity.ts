export class ProyectoEntity {
  constructor(
    public id: string,
    public nombreProyecto: string,
    public descripcion: string,
    public cliente: string,
    public fechaInicio: Date,
    public activo: boolean,
  ) {}
}
