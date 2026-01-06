import { Delete, Injectable } from '@nestjs/common';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
//domain
import {CreateArticuloUseCase, UpdateArticuloUseCase, DeleteArticuloUseCase} from 'src/domain';
//infrastructure
import { ArticuloRepositoryService, ActividadRepositoryService } from 'src/infrastructure';

@Injectable()
export class ArticuloService {

  constructor(
    private readonly articuloRepository: ArticuloRepositoryService,
    private readonly actividadRepository: ActividadRepositoryService
  ){}

  create(id_usuario: string, createArticuloDto: CreateArticuloDtoImpl) {
    const nuevoArticulo = new CreateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, createArticuloDto)
    return nuevoArticulo;
  }

  findAll(id_usuario: string) {
    return this.articuloRepository.getAllArticulos(id_usuario);
  }

  findOne(id_usuario: string, id_articulo: string) {
    return this.articuloRepository.getArticuloById(id_usuario, id_articulo);
  }

  update(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDtoImpl) {
    const editarArticulo = new UpdateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, id_articulo, updateArticuloDto);
    // return this.articuloRepository.updateArticulo(id_usuario, id_articulo, updateArticuloDto);
    return editarArticulo;
  }

  delete(id_usuario: string, id_articulo: string) {
    const deleteArticulo = new DeleteArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, id_articulo)
    // return this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
    return deleteArticulo;
  }
}
