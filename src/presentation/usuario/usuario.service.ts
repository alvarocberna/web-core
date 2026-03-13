import { Injectable } from '@nestjs/common';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioService: UsuarioRepositoryService
  ){}

  async create(id_proyecto: string, createUsuarioDto: CreateUsuarioDtoImpl){
    await this.usuarioService.createUsuario(id_proyecto, createUsuarioDto)
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id_usuario: string) {
    return this.usuarioService.getUsuarioById(id_usuario)
  }

  update(id: number, updateUsuarioDto: any) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
