import { Injectable } from '@nestjs/common';
import {
    ServiciosRepository,
    ServiciosEntity,
    ServicioEntity,
    CreateServiciosDto,
    UpdateServiciosDto,
    CreateServicioDto,
    UpdateServicioDto,
} from 'src/domain';
import { ServiciosDatasourceService } from 'src/infrastructure';

@Injectable()
export class ServiciosRepositoryService implements ServiciosRepository {
    constructor(private readonly serviciosDatasource: ServiciosDatasourceService) {}

    createServicios(id_usuario: string, createServiciosDto: CreateServiciosDto): Promise<ServiciosEntity> {
        return this.serviciosDatasource.createServicios(id_usuario, createServiciosDto);
    }

    getServicios(id_usuario: string): Promise<ServiciosEntity | null> {
        return this.serviciosDatasource.getServicios(id_usuario);
    }

    updateServicios(id_usuario: string, updateServiciosDto: UpdateServiciosDto): Promise<ServiciosEntity> {
        return this.serviciosDatasource.updateServicios(id_usuario, updateServiciosDto);
    }

    createServicio(id_usuario: string, createServicioDto: CreateServicioDto): Promise<ServicioEntity> {
        return this.serviciosDatasource.createServicio(id_usuario, createServicioDto);
    }

    getServicio(id_usuario: string, id_servicio: string): Promise<ServicioEntity> {
        return this.serviciosDatasource.getServicio(id_usuario, id_servicio);
    }

    updateServicio(id_usuario: string, id_servicio: string, updateServicioDto: UpdateServicioDto): Promise<ServicioEntity> {
        return this.serviciosDatasource.updateServicio(id_usuario, id_servicio, updateServicioDto);
    }

    deleteServicio(id_usuario: string, id_servicio: string): Promise<void> {
        return this.serviciosDatasource.deleteServicio(id_usuario, id_servicio);
    }
}
