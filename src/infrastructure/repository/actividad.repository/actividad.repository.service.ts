//nest
import { Injectable } from '@nestjs/common';
//domain
import { ActividadRepository, ActividadEntity } from 'src/domain';
//infrastructure
import { ActividadDatasourceService } from 'src/infrastructure';

@Injectable()
export class ActividadRepositoryService implements ActividadRepository {
    constructor(private readonly actividadDatasource: ActividadDatasourceService) {}

    async createActividad(id_usuario: string, id_articulo: string, accion: string): Promise<ActividadEntity> {
        return this.actividadDatasource.createActividad(id_usuario, id_articulo, accion);
    }

    async getActividadById(id_usuario: string, id_actividad: string): Promise<ActividadEntity | null> {
        return this.actividadDatasource.getActividadById(id_usuario, id_actividad);
    }

    async getActividadByArticulo(id_usuario: string, id_articulo: string): Promise<ActividadEntity[]> {
        return this.actividadDatasource.getActividadByArticulo(id_usuario, id_articulo);
    }

    async getActividadAll(id_usuario: string): Promise<ActividadEntity[]> {
        return this.actividadDatasource.getActividadAll(id_usuario);
    }

    async deleteActividad(id_usuario: string, id_actividad: string): Promise<void> {
        await this.actividadDatasource.deleteActividad(id_usuario, id_actividad);
    }
}
