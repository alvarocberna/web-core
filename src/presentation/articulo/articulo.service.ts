import { Injectable } from '@nestjs/common';
import { CreateArticuloFullDtoImpl } from './dto/create-articulo.dto';
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

  create(id_proyecto: string, createArticuloFullDtoImpl: CreateArticuloFullDtoImpl) {
    new CreateArticuloUseCase(this.articuloRepository, this.secArticuloRepositoryService).execute(id_proyecto, createArticuloFullDtoImpl)
    return 'This action adds a new articulo';
  }

  findAll(id_proyecto: string) {
    return this.articuloRepository.getAllArticulos(id_proyecto);
  }

  findOne(id_proyecto: string, id_articulo: string) {
    return this.articuloRepository.getArticuloById(id_proyecto, id_articulo);
  }

  update(id: number, updateArticuloDto: UpdateArticuloDtoImpl) {
    return `This action updates a #${id} articulo`;
  }

  remove(id: number) {
    return `This action removes a #${id} articulo`;
  }
}
