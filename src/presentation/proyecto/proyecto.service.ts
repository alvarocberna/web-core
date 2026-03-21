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

  findOne(proyecto_id: string) {
    return this.proyectoRepository.getProyectoById(proyecto_id);
  }

  update(proyecto_id: string, updateProyectoDto: UpdateProyectoDtoImpl) {
    return this.proyectoRepository.updateProyecto(proyecto_id, updateProyectoDto)
  }

  remove(proyecto_id: string) {
    return this.proyectoRepository.deleteProyecto(proyecto_id);
  }
}
