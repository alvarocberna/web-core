import { Injectable } from '@nestjs/common';
import {
  EquipoRepository,
  EquipoEntity,
  EmpleadoEntity,
  CreateEquipoDto,
  UpdateEquipoDto,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
  UpdateEmpleadoOrdenDto,
} from 'src/domain';
import { EquipoDatasourceService } from 'src/infrastructure';

@Injectable()
export class EquipoRepositoryService implements EquipoRepository {
  constructor(private readonly equipoDatasource: EquipoDatasourceService) {}

  createEquipo(
    usuarioId: string,
    createEquipoDto: CreateEquipoDto,
  ): Promise<EquipoEntity> {
    return this.equipoDatasource.createEquipo(usuarioId, createEquipoDto);
  }

  getEquipo(usuarioId: string): Promise<EquipoEntity | null> {
    return this.equipoDatasource.getEquipo(usuarioId);
  }

  updateEquipo(
    usuarioId: string,
    updateEquipoDto: UpdateEquipoDto,
  ): Promise<EquipoEntity> {
    return this.equipoDatasource.updateEquipo(usuarioId, updateEquipoDto);
  }

  createEmpleado(
    usuarioId: string,
    createEmpleadoDto: CreateEmpleadoDto,
  ): Promise<EmpleadoEntity> {
    return this.equipoDatasource.createEmpleado(usuarioId, createEmpleadoDto);
  }

  getEmpleado(usuarioId: string, empleadoId: string): Promise<EmpleadoEntity> {
    return this.equipoDatasource.getEmpleado(usuarioId, empleadoId);
  }

  updateEmpleado(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<EmpleadoEntity> {
    return this.equipoDatasource.updateEmpleado(
      usuarioId,
      empleadoId,
      updateEmpleadoDto,
    );
  }

  updateEmpleadoOrden(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDto,
  ): Promise<EmpleadoEntity> {
    return this.equipoDatasource.updateEmpleadoOrden(
      usuarioId,
      empleadoId,
      updateEmpleadoOrdenDto,
    );
  }

  deleteEmpleado(usuarioId: string, empleadoId: string): Promise<void> {
    return this.equipoDatasource.deleteEmpleado(usuarioId, empleadoId);
  }

  // PUBLIC ---------------------------------------------------------------

  getEquipoPublic(proyectoId: string): Promise<EquipoEntity | null> {
    return this.equipoDatasource.getEquipoPublic(proyectoId);
  }
}
