import { Injectable } from '@nestjs/common';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
//domain
import {CreateArticuloUseCase} from 'src/domain';
//infrastructure
import { ArticuloRepositoryService, SecArticuloRepositoryService } from 'src/infrastructure';

@Injectable()
export class ArticuloService {

  constructor(
    private readonly articuloRepository: ArticuloRepositoryService,
    private readonly secArticuloRepositoryService: SecArticuloRepositoryService
  ){}

  create(id_usuario: string, createArticuloDto: CreateArticuloDtoImpl) {
    const nuevoArticulo = new CreateArticuloUseCase(this.articuloRepository, this.secArticuloRepositoryService).execute(id_usuario, createArticuloDto)
    return nuevoArticulo;
  }

  findAll(id_usuario: string) {
    return this.articuloRepository.getAllArticulos(id_usuario);
  }

  findOne(id_usuario: string, id_articulo: string) {
    return this.articuloRepository.getArticuloById(id_usuario, id_articulo);
  }

  update(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDtoImpl) {
    return this.articuloRepository.updateArticulo(id_usuario, id_articulo, updateArticuloDto);
  }

  delete(id_usuario: string, id_articulo: string) {
    return this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
  }
}
