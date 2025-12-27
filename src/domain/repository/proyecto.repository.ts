import { ProyectoEntity, CreateProyectoDto, UpdateProyectoDto } from "src/domain";

export abstract class ProyectoRepository{
    abstract createProyecto(createProyectoDto: CreateProyectoDto): Promise<ProyectoEntity>;
    abstract getProyectoById(id_proyecto: string): Promise<ProyectoEntity | null>;
    abstract getAllProyectos(): Promise<ProyectoEntity[]>;
    abstract updateProyecto(id_proyecto: string, updateProyectoDto: UpdateProyectoDto): Promise<ProyectoEntity>;
    abstract deleteProyecto(id_proyecto: string): Promise<void>;
}