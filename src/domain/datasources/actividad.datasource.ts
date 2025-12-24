import { Actividad, CreateActividadDto, UpdateActividadDto } from "src/domain";

export abstract class ActividadDatasource{
    abstract createActividad(createActividadDto: CreateActividadDto): Promise<Actividad>;
    abstract getActividadById(id_proyecto: string, id_articulo: string, id_actividad: string): Promise<Actividad>;
    abstract getAllActividades(id_proyecto: string, id_articulo: string): Promise<Actividad[]>;
    abstract updateActividad(id_proyecto: string, id_articulo: string, id_actividad: string, updateActividadDto: UpdateActividadDto): Promise<Actividad>;
    abstract deleteActividad(id_proyecto: string, id_articulo: string, id_actividad: string): Promise<void>;
}