//nest
import { Injectable } from '@nestjs/common';
//domain
import { ActividadRepository, ActividadEntity } from 'src/domain';
//infrastructure
import { ActividadDatasourceService } from 'src/infrastructure';

@Injectable()
export class ActividadRepositoryService implements ActividadRepository {
  constructor(
    private readonly actividadDatasource: ActividadDatasourceService,
  ) {}

  async createActividad(
    usuarioId: string,
    articuloId: string,
    accion: string,
  ): Promise<ActividadEntity> {
    return this.actividadDatasource.createActividad(
      usuarioId,
      articuloId,
      accion,
    );
  }

  async getActividadById(
    usuarioId: string,
    actividadId: string,
  ): Promise<ActividadEntity | null> {
    return this.actividadDatasource.getActividadById(usuarioId, actividadId);
  }

  async getActividadByArticulo(
    usuarioId: string,
    articuloId: string,
  ): Promise<ActividadEntity[]> {
    return this.actividadDatasource.getActividadByArticulo(
      usuarioId,
      articuloId,
    );
  }

  async getActividadAll(usuarioId: string): Promise<ActividadEntity[]> {
    return this.actividadDatasource.getActividadAll(usuarioId);
  }

  async deleteActividad(
    usuarioId: string,
    actividadId: string,
  ): Promise<void> {
    await this.actividadDatasource.deleteActividad(usuarioId, actividadId);
  }
}
