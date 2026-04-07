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

    createArticulos(id_usuario: string, createArticulosDto: CreateArticulosDto): Promise<ArticulosEntity> {
        return this.articuloDatasource.createArticulos(id_usuario, createArticulosDto);
    }

    getArticulos(id_usuario: string): Promise<ArticulosEntity | null> {
        return this.articuloDatasource.getArticulos(id_usuario);
    }

    updateArticulos(id_usuario: string, updateArticulosDto: UpdateArticulosDto): Promise<ArticulosEntity> {
        return this.articuloDatasource.updateArticulos(id_usuario, updateArticulosDto);
    }

    // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

    createArticulo(id_usuario: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
        return this.articuloDatasource.createArticulo(id_usuario, createArticuloDto);
    }

    getArticuloById(id_usuario: string, id_articulo: string): Promise<ArticuloEntity | null> {
        return this.articuloDatasource.getArticuloById(id_usuario, id_articulo);
    }

    updateArticulo(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity> {
        return this.articuloDatasource.updateArticulo(id_usuario, id_articulo, updateArticuloDto);
    }

    updateArticuloStatus(id_usuario: string, id_articulo: string, data: {status: string}): Promise<ArticuloEntity> {
        return this.articuloDatasource.updateArticuloStatus(id_usuario, id_articulo, data);
    }

    deleteArticulo(id_usuario: string, id_articulo: string): Promise<void> {
        return this.articuloDatasource.deleteArticulo(id_usuario, id_articulo);
    }
}
