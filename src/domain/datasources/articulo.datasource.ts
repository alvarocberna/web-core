import { Articulo, CreateArticuloDto, UpdateArticuloDto } from "src/domain";

export abstract class ArticuloDatasource{
    abstract createArticulo(createArticuloDto: CreateArticuloDto): Promise<Articulo>;
    abstract getArticuloById(id_proyecto: string, id_articulo: string): Promise<Articulo>;
    abstract getAllArticulos(id_proyecto: string): Promise<Articulo[]>;
    abstract updateArticulo(id_proyecto: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<Articulo>;
    abstract deleteArticulo(id_proyecto: string, id_articulo: string): Promise<void>;
}