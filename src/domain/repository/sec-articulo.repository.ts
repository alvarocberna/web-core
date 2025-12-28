import { SecArticuloEntity, CreateSecArticuloDto, UpdateSecArticuloDto } from "src/domain";

export abstract class SecArticuloRepository{
    abstract createSecArticulo(id_proyecto: string, id_articulo: string, createSecArticuloDto: CreateSecArticuloDto[]): Promise<SecArticuloEntity[]>;
    abstract getSecArticuloById(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<SecArticuloEntity | null>;
    abstract getAllSecArticulos(id_proyecto: string, id_articulo: string): Promise<SecArticuloEntity[]>;
    abstract updateSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string, updateSecArticuloDto: UpdateSecArticuloDto): Promise<SecArticuloEntity>;
    abstract deleteSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<void>;
}