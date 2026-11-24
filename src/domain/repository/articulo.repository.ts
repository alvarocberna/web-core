import {
  ArticulosEntity,
  ArticuloEntity,
  CreateArticulosDto,
  UpdateArticulosDto,
  CreateArticuloDto,
  UpdateArticuloDto,
} from 'src/domain';

export abstract class ArticuloRepository {
  // ─── Articulos (entidad padre) ────────────────────────────────────────────
  abstract createArticulos(
    usuarioId: string,
    createArticulosDto: CreateArticulosDto,
  ): Promise<ArticulosEntity>;
  abstract getArticulos(usuarioId: string): Promise<ArticulosEntity | null>;
  abstract updateArticulos(
    usuarioId: string,
    updateArticulosDto: UpdateArticulosDto,
  ): Promise<ArticulosEntity>;

  // ─── Articulo (entidad hijo) ──────────────────────────────────────────────
  abstract createArticulo(
    usuarioId: string,
    createArticuloDto: CreateArticuloDto,
  ): Promise<ArticuloEntity>;
  abstract getArticuloById(
    usuarioId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null>;
  abstract updateArticulo(
    usuarioId: string,
    articuloId: string,
    updateArticuloDto: UpdateArticuloDto,
  ): Promise<ArticuloEntity>;
  abstract deleteArticulo(usuarioId: string, articuloId: string): Promise<void>;

  // ─── Articulos Public ────────────────────────────────────────────
  abstract getArticulosPublic(
    proyectoId: string,
  ): Promise<ArticulosEntity | null>;
  abstract getArticuloByIdPublic(
    proyectoId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null>;
}
