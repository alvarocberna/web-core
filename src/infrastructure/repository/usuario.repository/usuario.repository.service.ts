//nest
import { Injectable } from '@nestjs/common';
//domain
import {
  UsuarioRepository,
  UsuarioEntity,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioInfoDto,
  UpdateUsuarioPasswordDto,
} from 'src/domain';
//infrastructure
import { UsuarioDatasourceService } from 'src/infrastructure/datasources/usuario.datasource/usuario.datasource.service';

@Injectable()
export class UsuarioRepositoryService implements UsuarioRepository {
  constructor(private readonly usuarioDatasource: UsuarioDatasourceService) {}

  async createUsuario(
    proyectoId: string,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioEntity> {
    return this.usuarioDatasource.createUsuario(proyectoId, createUsuarioDto);
  }

  async getAllUsuarios(proyectoId: string): Promise<UsuarioEntity[]> {
    return this.usuarioDatasource.getAllUsuarios(proyectoId);
  }

  async getUsuarioById(usuarioId: string): Promise<UsuarioEntity | null> {
    return this.usuarioDatasource.getUsuarioById(usuarioId);
  }

  async getUsuarioByEmail(email: string): Promise<UsuarioEntity | null> {
    return this.usuarioDatasource.getUsuarioByEmail(email);
  }

  async updateUsuario(
    usuarioId: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioEntity> {
    return this.usuarioDatasource.updateUsuario(usuarioId, updateUsuarioDto);
  }

  async updateUsuarioPassword(
    usuarioId: string,
    updateUsuarioPasswordDto: UpdateUsuarioPasswordDto,
  ): Promise<void> {
    return this.usuarioDatasource.updateUsuarioPassword(
      usuarioId,
      updateUsuarioPasswordDto,
    );
  }

  async deleteUsuario(proyectoId: string, usuarioId: string): Promise<void> {
    return this.usuarioDatasource.deleteUsuario(proyectoId, usuarioId);
  }

  async setRefreshToken(usuarioId: string, hashedRt: string) {
    await this.usuarioDatasource.setRefreshToken(usuarioId, hashedRt);
  }

  async removeRefreshToken(usuarioId: string) {
    await this.usuarioDatasource.removeRefreshToken(usuarioId);
  }
}
