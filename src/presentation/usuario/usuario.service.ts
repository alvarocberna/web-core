import { Injectable } from '@nestjs/common';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import { UpdateUsuarioDtoImpl } from './dto/update-user.dto';
import { UpdateUsuarioInfoDtoImpl } from './dto/update-user-info.dto';
import { UpdateUsuarioPasswordDtoImpl } from './dto/update-user-password.dto';
import { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioService: UsuarioRepositoryService) {}

  //servicios para rol admin y superadmin
  async create(proyectoId: string, createUsuarioDto: CreateUsuarioDtoImpl) {
    await this.usuarioService.createUsuario(proyectoId, createUsuarioDto);
  }

  findAll(proyectoId: string) {
    return this.usuarioService.getAllUsuarios(proyectoId);
  }

  findById(usuarioId: string) {
    return this.usuarioService.getUsuarioById(usuarioId);
  }

  update(usuarioId: string, updateUsuarioDto: UpdateUsuarioDtoImpl) {
    return this.usuarioService.updateUsuario(usuarioId, updateUsuarioDto);
  }

  remove(proyectoId: string, usuarioId: string) {
    return this.usuarioService.deleteUsuario(proyectoId, usuarioId);
  }

  //servicios para rol user

  updatePassword(
    usuarioId: string,
    updateUsuarioPasswordDto: UpdateUsuarioPasswordDtoImpl,
  ) {
    return this.usuarioService.updateUsuarioPassword(
      usuarioId,
      updateUsuarioPasswordDto,
    );
  }
}
