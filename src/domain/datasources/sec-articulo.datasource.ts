import { SecArticulo, CreateSecArticuloDto, UpdateSecArticuloDto } from "src/domain";

export abstract class SecArticuloDatasource{
    abstract createSecArticulo(createSecArticuloDto: CreateSecArticuloDto): Promise<SecArticulo>;
    abstract getSecArticuloById(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<SecArticulo>;
    abstract getAllSecArticulos(id_proyecto: string, id_articulo: string): Promise<SecArticulo[]>;
    abstract updateSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string, updateSecArticuloDto: UpdateSecArticuloDto): Promise<SecArticulo>;
    abstract deleteSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<void>;
}