import {
  UsuarioEntity,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioInfoDto,
  UpdateUsuarioPasswordDto,
} from 'src/domain';

export abstract class UsuarioRepository {
  abstract createUsuario(
    proyectoId: string,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioEntity>;
  abstract getUsuarioById(usuarioId: string): Promise<UsuarioEntity | null>;
  abstract getUsuarioByEmail(email: string): Promise<UsuarioEntity | null>;
  abstract getAllUsuarios(proyectoId: string): Promise<UsuarioEntity[]>;
  abstract updateUsuario(
    usuarioId: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioEntity>;
  abstract updateUsuarioPassword(
    usuarioId: string,
    updateUsuarioPasswordDto: UpdateUsuarioPasswordDto,
  ): Promise<void>;
  abstract deleteUsuario(proyectoId: string, usuarioId: string): Promise<void>;
  abstract setRefreshToken(id: string, hashedRt: string): Promise<void>;
  abstract removeRefreshToken(id: string): Promise<void>;
}
