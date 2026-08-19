import { Injectable } from '@nestjs/common';
//domain
import {
  ProyectoRepository,
  CreateProyectoDto,
  UpdateProyectoDto,
  ProyectoEntity,
} from 'src/domain';
//infrastructure
import { ProyectoDatasourceService } from 'src/infrastructure';

@Injectable()
export class ProyectoRepositoryService implements ProyectoRepository {
  constructor(private readonly proyectoDatasource: ProyectoDatasourceService) {}

  async createProyecto(
    createProyectoDto: CreateProyectoDto,
  ): Promise<ProyectoEntity> {
    const proyecto = this.proyectoDatasource.createProyecto(createProyectoDto);
    return proyecto;
  }

  async getProyectoById(proyectoId: string): Promise<ProyectoEntity | null> {
    const proyecto = this.proyectoDatasource.getProyectoById(proyectoId);
    return proyecto;
  }

  async getAllProyectos(): Promise<ProyectoEntity[]> {
    const proyectos = this.proyectoDatasource.getAllProyectos();
    return proyectos;
  }

  async updateProyecto(
    proyectoId: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<ProyectoEntity> {
    const proyecto = this.proyectoDatasource.updateProyecto(
      proyectoId,
      updateProyectoDto,
    );
    return proyecto;
  }

  async deleteProyecto(proyectoId: string): Promise<void> {
    await this.proyectoDatasource.deleteProyecto(proyectoId);
  }
}
