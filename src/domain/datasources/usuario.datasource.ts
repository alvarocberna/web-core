import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "src/domain";

export abstract class UsuarioDatasource{
    abstract createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    abstract getUsuarioById(id_proyecto: string, id_usuario: string): Promise<Usuario>;
    abstract getAllUsuarios(id_proyecto: string): Promise<Usuario[]>;
    abstract updateUsuario(id_proyecto: string, id_usuario: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
    abstract deleteUsuario(id_proyecto: string, id_usuario: string): Promise<void>;
}