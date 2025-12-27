import { ActividadEntity, CreateActividadDto, UpdateActividadDto } from "src/domain";

export abstract class ActividadDatasource{
    abstract createActividad(createActividadDto: CreateActividadDto): Promise<ActividadEntity>;
    abstract getActividadById(id_proyecto: string, id_articulo: string, id_actividad: string): Promise<ActividadEntity>;
    abstract getAllActividades(id_proyecto: string, id_articulo: string): Promise<ActividadEntity[]>;
    abstract updateActividad(id_proyecto: string, id_articulo: string, id_actividad: string, updateActividadDto: UpdateActividadDto): Promise<ActividadEntity>;
    abstract deleteActividad(id_proyecto: string, id_articulo: string, id_actividad: string): Promise<void>;
}