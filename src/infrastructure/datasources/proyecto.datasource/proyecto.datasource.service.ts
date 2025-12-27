//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {ProyectoDatasource ,ProyectoEntity, CreateProyectoDto, UpdateProyectoDto} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
// import { prisma } from '../../../../node_modules/prisma'

@Injectable()
export class ProyectoDatasourceService implements ProyectoDatasource {
    constructor(private readonly prismaService: PrismaService) {}

    async createProyecto(createProyectoDto: CreateProyectoDto): Promise<ProyectoEntity> {
        const proyecto = this.prismaService.proyecto.create({ 
            data: {
                id: 'jkfdoikger',
                ...createProyectoDto,
                fecha_inicio: new Date(),
            }
        });
        return proyecto;
    }

    async getProyectoById(id_proyecto: string): Promise<ProyectoEntity | null> {
        const proyecto = this.prismaService.proyecto.findUnique({ 
            where: { 
                id: id_proyecto, 
            } 
        });
        if (!proyecto) {
            throw new NotFoundException('Proyecto not found');
        }
        return proyecto;
    }

    async getAllProyectos(): Promise<ProyectoEntity[]> {
        return this.prismaService.proyecto.findMany();
    }

    async updateProyecto(id_proyecto: string, updateProyectoDto: UpdateProyectoDto): Promise<ProyectoEntity> {
        const proyecto = await this.prismaService.proyecto.update({
            where: { id: id_proyecto },
            data: { ...updateProyectoDto },
        });
        return proyecto;
    }
    
    async deleteProyecto(id_proyecto: string): Promise<void> {
        await this.prismaService.proyecto.delete({
            where: { id: id_proyecto },
        });
    }
}
