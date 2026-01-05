import { UsuarioEntity, CreateUsuarioDto, UpdateUsuarioDto } from "src/domain";

export abstract class UsuarioRepository{
    abstract createUsuario(id_proyecto: string, createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity>;
    abstract getUsuarioById(id_usuario: string): Promise<UsuarioEntity | null>;
    abstract getUsuarioByEmail(email: string): Promise<UsuarioEntity | null>;
    abstract getAllUsuarios(id_proyecto: string): Promise<UsuarioEntity[]>;
    abstract updateUsuario(id_proyecto: string, id_usuario: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity>;
    abstract deleteUsuario(id_proyecto: string, id_usuario: string): Promise<void>;
    abstract setRefreshToken(id: string, hashedRt: string): Promise<void>;
    abstract removeRefreshToken(id: string): Promise<void>;
}