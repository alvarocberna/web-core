import { Injectable } from '@nestjs/common';
import { CreateProyectoDtoImpl } from './dto/create-proyecto.dto';
import { UpdateProyectoDtoImpl } from './dto/update-proyecto.dto';
import { ProyectoRepositoryService } from 'src/infrastructure';

@Injectable()
export class ProyectoService {
  constructor(private readonly proyectoRepository: ProyectoRepositoryService) {}

  create(createProyectoDto: CreateProyectoDtoImpl) {
    return this.proyectoRepository.createProyecto(createProyectoDto);
  }

  findAll() {
    return this.proyectoRepository.getAllProyectos();
  }

  findOne(id_proyecto: number) {
    return `This action returns a #${id_proyecto} proyecto`;
  }

  update(id_proyecto: number, updateProyectoDto: UpdateProyectoDtoImpl) {
    return `This action updates a #${id_proyecto} proyecto`;
  }

  remove(id_proyecto: number) {
    return `This action removes a #${id_proyecto} proyecto`;
  }
}
