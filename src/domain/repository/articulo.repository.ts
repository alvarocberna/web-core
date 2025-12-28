import { ArticuloEntity, CreateArticuloDto, UpdateArticuloDto } from "src/domain";

export abstract class ArticuloRepository{
    abstract createArticulo(id_proyecto: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity>;
    abstract getArticuloById(id_proyecto: string, id_articulo: string): Promise<ArticuloEntity | null>;
    abstract getAllArticulos(id_proyecto: string): Promise<ArticuloEntity[]>;
    abstract updateArticulo(id_proyecto: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity>;
    abstract deleteArticulo(id_proyecto: string, id_articulo: string): Promise<void>;
}