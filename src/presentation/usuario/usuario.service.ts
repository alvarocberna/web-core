import { Injectable } from '@nestjs/common';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import { UpdateUsuarioInfoDtoImpl } from './dto/update-user-info.dto';
import { UpdateUsuarioPasswordDtoImpl } from './dto/update-user-password.dto';
import { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioService: UsuarioRepositoryService
  ){}

  //servicios para rol admin y superadmin
  async create(proyecto_id: string, createUsuarioDto: CreateUsuarioDtoImpl){
    await this.usuarioService.createUsuario(proyecto_id, createUsuarioDto)
  }

  findAll(proyecto_id: string) {
    return this.usuarioService.getAllUsuarios(proyecto_id);
  }

  findById(usuario_id: string) {
    return this.usuarioService.getUsuarioById(usuario_id)
  }

  update(proyecto_id: string, usuario_id: string, updateUsuarioDto: any) {
    return this.usuarioService.updateUsuario(proyecto_id, usuario_id, updateUsuarioDto)
  }

  remove(proyecto_id: string, usuario_id: string) {
    return this.usuarioService.deleteUsuario(proyecto_id, usuario_id);
  }

  //servicios para rol user
  updateInfo(usuario_id: string, updateUsuarioInfoDto: UpdateUsuarioInfoDtoImpl) {
    return this.usuarioService.updateUsuarioInfo(usuario_id, updateUsuarioInfoDto);
  }

  updatePassword(usuario_id: string, updateUsuarioPasswordDto: UpdateUsuarioPasswordDtoImpl) {
    return this.usuarioService.updateUsuarioPassword(usuario_id, updateUsuarioPasswordDto);
  }

}
