import { ActividadEntity } from 'src/domain';

export abstract class ActividadRepository {
  abstract createActividad(
    usuarioId: string,
    articuloId: string,
    accion: string,
  ): Promise<ActividadEntity>;
  abstract getActividadById(
    usuarioId: string,
    actividadId: string,
  ): Promise<ActividadEntity | null>;
  abstract getActividadByArticulo(
    usuarioId: string,
    articuloId: string,
  ): Promise<ActividadEntity[]>;
  abstract getActividadAll(usuarioId: string): Promise<ActividadEntity[]>;
  abstract deleteActividad(
    usuarioId: string,
    actividadId: string,
  ): Promise<void>;
}
