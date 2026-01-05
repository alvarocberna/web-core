//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {SecArticuloDatasource ,SecArticuloEntity, CreateSecArticuloDto, UpdateSecArticuloDto} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import {UuidService} from '../../adapters/uuid/uuid.service'

@Injectable()
export class SecArticuloDatasourceService implements SecArticuloDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService
    ) {}

    async createSecArticulo(id_usuario: string, id_articulo: string, createSecArticuloDto: CreateSecArticuloDto[]): Promise<SecArticuloEntity[]> {
        //obtenemos el user
        const user = await this.prismaService.usuario.findUnique({
            where: {id: id_usuario}
        })
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        const id_proyecto = user.proyecto_id;
        //
        const promises = createSecArticuloDto.map(secArticulo =>
            this.prismaService.secArticulo.create({
            data: {
                id: this.uuidService.generate(),
                ...secArticulo,
                articulo_id: id_articulo,
                proyecto_id: id_proyecto,
            }
            })
        );
        const secArticulos = await Promise.all(promises);
        return secArticulos;
    }

    async getSecArticuloById(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<SecArticuloEntity | null> {
        const sec_articulo = this.prismaService.secArticulo.findUnique({ 
            where: { 
                id: id_sec_articulo,
                articulo_id: id_articulo,
                proyecto_id: id_proyecto
            } 
        });
        if (!sec_articulo) {
            throw new NotFoundException('Secarticulo not found');
        }
        return sec_articulo;
    }

    async getAllSecArticulos(id_proyecto: string, id_articulo: string): Promise<SecArticuloEntity[]> {
        return this.prismaService.secArticulo.findMany({
                where: {
                    articulo_id: id_articulo,
                    proyecto_id: id_proyecto
                }
            });
    }

    async updateSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string,  updateSecArticuloDto: UpdateSecArticuloDto): Promise<SecArticuloEntity> {
        const sec_articulo = await this.prismaService.secArticulo.update({
            where: { 
                id: id_sec_articulo, 
                articulo_id: id_articulo,
                proyecto_id: id_proyecto 
            },
            data: { ...updateSecArticuloDto },
        });
        return sec_articulo;
    }
    
    async deleteSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<void> {
        await this.prismaService.secArticulo.delete({
            where: { 
                id: id_sec_articulo, 
                articulo_id: id_articulo,
                proyecto_id: id_proyecto },
        });
    }
}
