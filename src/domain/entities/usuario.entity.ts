
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
    public img_url: string | null,
    public img_alt: string | null,
    public proyecto_id: string,
  ){} 
}