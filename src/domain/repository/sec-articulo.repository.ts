import {
  SecArticuloEntity,
  CreateSecArticuloDto,
  UpdateSecArticuloDto,
} from 'src/domain';

export abstract class SecArticuloRepository {
  abstract createSecArticulo(
    usuarioId: string,
    articuloId: string,
    createSecArticuloDto: CreateSecArticuloDto[],
  ): Promise<SecArticuloEntity[]>;
  abstract getSecArticuloById(
    proyectoId: string,
    articuloId: string,
    secArticuloId: string,
  ): Promise<SecArticuloEntity | null>;
  abstract getAllSecArticulos(
    proyectoId: string,
    articuloId: string,
  ): Promise<SecArticuloEntity[]>;
  abstract updateSecArticulo(
    proyectoId: string,
    articuloId: string,
    secArticuloId: string,
    updateSecArticuloDto: UpdateSecArticuloDto,
  ): Promise<SecArticuloEntity>;
  abstract deleteSecArticulo(
    proyectoId: string,
    articuloId: string,
    secArticuloId: string,
  ): Promise<void>;
}
