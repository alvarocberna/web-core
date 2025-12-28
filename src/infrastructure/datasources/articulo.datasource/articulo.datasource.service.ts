//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {ArticuloDatasource ,ArticuloEntity, CreateArticuloDto, UpdateArticuloDto} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import {UuidService} from '../../adapters/uuid/uuid.service';

@Injectable()
export class ArticuloDatasourceService implements ArticuloDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService
    ) {}

    async createArticulo(id_proyecto: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
        let nro_articulo: number = 1;
        const count: number = await this.prismaService.articulo.count({
            where: {
                proyecto_id: id_proyecto
            }
        })
        if(count == 0){
            nro_articulo = 1;
        }else if (count > 0){
            nro_articulo = count + 1;
        }
        const articulo = this.prismaService.articulo.create({ 
            data: {
                id: this.uuidService.generate(),
                nro_articulo: nro_articulo,
                ...createArticuloDto,
                proyecto_id: id_proyecto,
            }
        });
        return articulo;
    }

    async getArticuloById(id_proyecto: string, id_articulo: string): Promise<ArticuloEntity | null> {
        const articulo = this.prismaService.articulo.findUnique({ 
            where: { 
                id: id_articulo,
                proyecto_id: id_proyecto
            } 
        });
        if (!articulo) {
            throw new NotFoundException('articulo not found');
        }
        return articulo;
    }

    async getAllArticulos(id_proyecto: string): Promise<ArticuloEntity[]> {
        return this.prismaService.articulo.findMany({
                where: {
                    proyecto_id: id_proyecto
                }
            });
    }

    async updateArticulo(id_proyecto: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity> {
        const articulo = await this.prismaService.articulo.update({
            where: { id: id_articulo, proyecto_id: id_proyecto },
            data: { ...updateArticuloDto },
        });
        return articulo;
    }
    
    async deleteArticulo(id_proyecto: string, id_articulo: string): Promise<void> {
        await this.prismaService.articulo.delete({
            where: { id: id_articulo, proyecto_id: id_proyecto },
        });
    }
}
