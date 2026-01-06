import { ActividadEntity } from "src/domain";

export abstract class ActividadRepository{
    abstract createActividad(id_usuario: string, id_articulo: string, accion: string): Promise<ActividadEntity>;
    abstract getActividadById(id_usuario: string, id_actividad: string): Promise<ActividadEntity | null>;
    abstract getActividadByArticulo(id_usuario: string, id_articulo: string): Promise<ActividadEntity[]>;
    abstract getActividadAll(id_usuario: string): Promise<ActividadEntity[]>;
    abstract deleteActividad(id_usuario: string, id_actividad: string): Promise<void>;
}