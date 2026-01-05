import { Injectable } from '@nestjs/common';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioService: UsuarioRepositoryService
  ){}

  create(createUsuarioDto: any) {
    return 'This action adds a new usuario';
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
