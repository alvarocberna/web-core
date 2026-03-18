import { ServiciosEntity, ServicioEntity, CreateServiciosDto, UpdateServiciosDto, CreateServicioDto, UpdateServicioDto } from 'src/domain';

export abstract class ServiciosRepository {
    abstract createServicios(id_usuario: string, createServiciosDto: CreateServiciosDto): Promise<ServiciosEntity>;
    abstract getServicios(id_usuario: string): Promise<ServiciosEntity | null>;
    abstract updateServicios(id_usuario: string, updateServiciosDto: UpdateServiciosDto): Promise<ServiciosEntity>;

    abstract createServicio(id_usuario: string, createServicioDto: CreateServicioDto): Promise<ServicioEntity>;
    abstract getServicio(id_usuario: string, id_servicio: string): Promise<ServicioEntity>;
    abstract updateServicio(id_usuario: string, id_servicio: string, updateServicioDto: UpdateServicioDto): Promise<ServicioEntity>;
    abstract deleteServicio(id_usuario: string, id_servicio: string): Promise<void>;
}
