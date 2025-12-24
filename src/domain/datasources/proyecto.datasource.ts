import { Proyecto, CreateProyectoDto, UpdateProyectoDto } from "src/domain";

export abstract class ProyectoDatasource{
    abstract createProyecto(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
    abstract getProyectoById(id_proyecto: string): Promise<Proyecto>;
    abstract getAllProyectos(): Promise<Proyecto[]>;
    abstract updateProyecto(id_proyecto: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto>;
    abstract deleteProyecto(id_proyecto: string): Promise<void>;
}