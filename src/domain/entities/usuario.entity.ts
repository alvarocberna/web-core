
export class UsuarioEntity {
  constructor(
    public id: string,
    public nombre: string,
    public apellido: string,
    public email: string,
    public fechaCreacion: Date,
    public password: string,
    public hashedRt: string | null,
    public rol: string,
    public proyecto_id: string,
  ){} 
}