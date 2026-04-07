import { Injectable } from '@nestjs/common';
import { CreateProyectoDtoImpl } from './dto/create-proyecto.dto';
import { UpdateProyectoDtoImpl } from './dto/update-proyecto.dto';
import { ProyectoRepositoryService } from 'src/infrastructure';
import { CreateProyectoUseCase } from '../../domain/use-cases/create-proyecto.use-case';
import { EquipoRepositoryService, ServiciosRepositoryService, ArticuloRepositoryService, TestimoniosRepositoryService, UsuarioRepositoryService } from 'src/infrastructure';


@Injectable()
export class ProyectoService {
  constructor(
    private readonly proyectoRepository: ProyectoRepositoryService,
    private readonly equipoRepository: EquipoRepositoryService,
    private readonly serviciosRepository: ServiciosRepositoryService,
    private readonly articuloRepository: ArticuloRepositoryService,
    private readonly testimoniosRepository: TestimoniosRepositoryService,
    private readonly usuarioRepository: UsuarioRepositoryService,
  ) {}

  create(createProyectoDto: CreateProyectoDtoImpl) {
    // return this.proyectoRepository.createProyecto(createProyectoDto);
    return new CreateProyectoUseCase(
      this.proyectoRepository,
      this.equipoRepository,
      this.serviciosRepository,
      this.articuloRepository,
      this.testimoniosRepository,
      this.usuarioRepository
    ).execute(createProyectoDto); 
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
