import { ArticulosEntity, ArticuloEntity, CreateArticulosDto, UpdateArticulosDto, CreateArticuloDto, UpdateArticuloDto } from "src/domain";

export abstract class ArticuloRepository {
    // ─── Articulos (entidad padre) ────────────────────────────────────────────
    abstract createArticulos(id_usuario: string, createArticulosDto: CreateArticulosDto): Promise<ArticulosEntity>;
    abstract getArticulos(id_usuario: string): Promise<ArticulosEntity | null>;
    abstract updateArticulos(id_usuario: string, updateArticulosDto: UpdateArticulosDto): Promise<ArticulosEntity>;

    // ─── Articulo (entidad hijo) ──────────────────────────────────────────────
    abstract createArticulo(id_usuario: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity>;
    abstract getArticuloById(id_usuario: string, id_articulo: string): Promise<ArticuloEntity | null>;
    abstract updateArticulo(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity>;
    abstract deleteArticulo(id_usuario: string, id_articulo: string): Promise<void>;
}
