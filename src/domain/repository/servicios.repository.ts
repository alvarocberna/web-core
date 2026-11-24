import {
  ServiciosEntity,
  ServicioEntity,
  CreateServiciosDto,
  UpdateServiciosDto,
  CreateServicioDto,
  UpdateServicioDto,
  UpdateServicioOrdenDto,
} from 'src/domain';

export abstract class ServiciosRepository {
  abstract createServicios(
    usuarioId: string,
    createServiciosDto: CreateServiciosDto,
  ): Promise<ServiciosEntity>;
  abstract getServicios(usuarioId: string): Promise<ServiciosEntity | null>;
  abstract updateServicios(
    usuarioId: string,
    updateServiciosDto: UpdateServiciosDto,
  ): Promise<ServiciosEntity>;

  abstract createServicio(
    usuarioId: string,
    createServicioDto: CreateServicioDto,
  ): Promise<ServicioEntity>;
  abstract getServicio(
    usuarioId: string,
    servicioId: string,
  ): Promise<ServicioEntity>;
  abstract updateServicio(
    usuarioId: string,
    servicioId: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<ServicioEntity>;
  abstract updateServicioOrden(
    usuarioId: string,
    servicioId: string,
    updateServicioOrdenDto: UpdateServicioOrdenDto,
  ): Promise<ServicioEntity>;
  abstract deleteServicio(usuarioId: string, servicioId: string): Promise<void>;

  //public
  abstract getServiciosPublic(
    proyectoId: string,
  ): Promise<ServiciosEntity | null>;
}
