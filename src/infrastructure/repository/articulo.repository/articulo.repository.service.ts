//nest
import { Injectable } from '@nestjs/common';
//domain
import {
  ArticuloRepository,
  ArticulosEntity,
  ArticuloEntity,
  CreateArticulosDto,
  UpdateArticulosDto,
  CreateArticuloDto,
  UpdateArticuloDto,
} from 'src/domain';
//infrastructure
import { ArticuloDatasourceService } from 'src/infrastructure';

@Injectable()
export class ArticuloRepositoryService implements ArticuloRepository {
  constructor(private readonly articuloDatasource: ArticuloDatasourceService) {}

  // ─── Articulos (entidad padre) ────────────────────────────────────────────

  createArticulos(
    usuarioId: string,
    createArticulosDto: CreateArticulosDto,
  ): Promise<ArticulosEntity> {
    return this.articuloDatasource.createArticulos(
      usuarioId,
      createArticulosDto,
    );
  }

  getArticulos(usuarioId: string): Promise<ArticulosEntity | null> {
    return this.articuloDatasource.getArticulos(usuarioId);
  }

  updateArticulos(
    usuarioId: string,
    updateArticulosDto: UpdateArticulosDto,
  ): Promise<ArticulosEntity> {
    return this.articuloDatasource.updateArticulos(
      usuarioId,
      updateArticulosDto,
    );
  }

  // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

  createArticulo(
    usuarioId: string,
    createArticuloDto: CreateArticuloDto,
  ): Promise<ArticuloEntity> {
    return this.articuloDatasource.createArticulo(usuarioId, createArticuloDto);
  }

  getArticuloById(
    usuarioId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null> {
    return this.articuloDatasource.getArticuloById(usuarioId, articuloId);
  }

  updateArticulo(
    usuarioId: string,
    articuloId: string,
    updateArticuloDto: UpdateArticuloDto,
  ): Promise<ArticuloEntity> {
    return this.articuloDatasource.updateArticulo(
      usuarioId,
      articuloId,
      updateArticuloDto,
    );
  }

  updateArticuloStatus(
    usuarioId: string,
    articuloId: string,
    data: { status: string },
  ): Promise<ArticuloEntity> {
    return this.articuloDatasource.updateArticuloStatus(
      usuarioId,
      articuloId,
      data,
    );
  }

  deleteArticulo(usuarioId: string, articuloId: string): Promise<void> {
    return this.articuloDatasource.deleteArticulo(usuarioId, articuloId);
  }

  // ─── Articulos Public ──────────────────────────────────────────────

  getArticulosPublic(proyectoId: string): Promise<ArticulosEntity | null> {
    return this.articuloDatasource.getArticulosPublic(proyectoId);
  }

  getArticuloByIdPublic(
    proyectoId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null> {
    return this.articuloDatasource.getArticuloByIdPublic(
      proyectoId,
      articuloId,
    );
  }
}
