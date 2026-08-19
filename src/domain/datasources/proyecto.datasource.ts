import {
  ProyectoEntity,
  CreateProyectoDto,
  UpdateProyectoDto,
} from 'src/domain';

export abstract class ProyectoDatasource {
  abstract createProyecto(
    createProyectoDto: CreateProyectoDto,
  ): Promise<ProyectoEntity>;
  abstract getProyectoById(proyectoId: string): Promise<ProyectoEntity | null>;
  abstract getAllProyectos(): Promise<ProyectoEntity[]>;
  abstract updateProyecto(
    proyectoId: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<ProyectoEntity>;
  abstract deleteProyecto(proyectoId: string): Promise<void>;
}
