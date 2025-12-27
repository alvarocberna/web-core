import { Injectable } from '@nestjs/common';
//domain
import { ProyectoRepository, CreateProyectoDto, UpdateProyectoDto, ProyectoEntity } from 'src/domain';
//infrastructure
import { ProyectoDatasourceService } from 'src/infrastructure';

@Injectable()
export class ProyectoRepositoryService implements ProyectoRepository {
    constructor(private readonly proyectoDatasource: ProyectoDatasourceService) {}

    async createProyecto(createProyectoDto: CreateProyectoDto): Promise<ProyectoEntity> {
        const proyecto = this.proyectoDatasource.createProyecto(createProyectoDto);
        return proyecto;
    }

    async getProyectoById(id_proyecto: string): Promise<ProyectoEntity | null> {
        const proyecto = this.proyectoDatasource.getProyectoById(id_proyecto);
        return proyecto;
    }

    async getAllProyectos(): Promise<ProyectoEntity[]> {
        const proyectos = this.proyectoDatasource.getAllProyectos();
        return proyectos;
    }

    async updateProyecto(id_proyecto: string, updateProyectoDto: UpdateProyectoDto): Promise<ProyectoEntity> {
        const proyecto = this.proyectoDatasource.updateProyecto(id_proyecto, updateProyectoDto);
        return proyecto;
    }
    
    async deleteProyecto(id_proyecto: string): Promise<void> {
        await this.proyectoDatasource.deleteProyecto(id_proyecto);
    }
    
}
