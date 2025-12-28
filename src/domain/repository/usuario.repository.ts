import { UsuarioEntity, CreateUsuarioDto, UpdateUsuarioDto } from "src/domain";

export abstract class UsuarioRepository{
    abstract createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity>;
    abstract getUsuarioById(id_proyecto: string, id_usuario: string): Promise<UsuarioEntity | null>;
    abstract getAllUsuarios(id_proyecto: string): Promise<UsuarioEntity[]>;
    abstract updateUsuario(id_proyecto: string, id_usuario: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity>;
    abstract deleteUsuario(id_proyecto: string, id_usuario: string): Promise<void>;
}