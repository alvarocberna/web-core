import { Injectable } from '@nestjs/common';
import {
  ServiciosRepository,
  ServiciosEntity,
  ServicioEntity,
  CreateServiciosDto,
  UpdateServiciosDto,
  CreateServicioDto,
  UpdateServicioDto,
  UpdateServicioOrdenDto,
} from 'src/domain';
import { ServiciosDatasourceService } from 'src/infrastructure';

@Injectable()
export class ServiciosRepositoryService implements ServiciosRepository {
  constructor(
    private readonly serviciosDatasource: ServiciosDatasourceService,
  ) {}

  createServicios(
    usuarioId: string,
    createServiciosDto: CreateServiciosDto,
  ): Promise<ServiciosEntity> {
    return this.serviciosDatasource.createServicios(
      usuarioId,
      createServiciosDto,
    );
  }

  getServicios(usuarioId: string): Promise<ServiciosEntity | null> {
    return this.serviciosDatasource.getServicios(usuarioId);
  }

  updateServicios(
    usuarioId: string,
    updateServiciosDto: UpdateServiciosDto,
  ): Promise<ServiciosEntity> {
    return this.serviciosDatasource.updateServicios(
      usuarioId,
      updateServiciosDto,
    );
  }

  createServicio(
    usuarioId: string,
    createServicioDto: CreateServicioDto,
  ): Promise<ServicioEntity> {
    return this.serviciosDatasource.createServicio(
      usuarioId,
      createServicioDto,
    );
  }

  getServicio(usuarioId: string, servicioId: string): Promise<ServicioEntity> {
    return this.serviciosDatasource.getServicio(usuarioId, servicioId);
  }

  updateServicio(
    usuarioId: string,
    servicioId: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<ServicioEntity> {
    return this.serviciosDatasource.updateServicio(
      usuarioId,
      servicioId,
      updateServicioDto,
    );
  }

  updateServicioOrden(
    usuarioId: string,
    servicioId: string,
    updateServicioOrdenDto: UpdateServicioOrdenDto,
  ): Promise<ServicioEntity> {
    return this.serviciosDatasource.updateServicioOrden(
      usuarioId,
      servicioId,
      updateServicioOrdenDto,
    );
  }

  deleteServicio(usuarioId: string, servicioId: string): Promise<void> {
    return this.serviciosDatasource.deleteServicio(usuarioId, servicioId);
  }

  //PUBLIC --------------------------------------------------------------
  getServiciosPublic(proyectoId: string): Promise<ServiciosEntity | null> {
    return this.serviciosDatasource.getServiciosPublic(proyectoId);
  }
}
