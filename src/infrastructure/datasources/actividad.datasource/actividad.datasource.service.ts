//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import { ActividadDatasource, ActividadEntity } from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';

@Injectable()
export class ActividadDatasourceService implements ActividadDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService
    ) {}

    async createActividad(id_usuario: string, id_articulo: string, accion: string): Promise<ActividadEntity> {
        // Obtener el usuario y validar
        const user = await this.prismaService.usuario.findUnique({
            where: { id: id_usuario }
        });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const proyecto_id = user.proyecto_id;

        // Validar que el artículo exista
        const articulo = await this.prismaService.articulo.findUnique({
            where: { id: id_articulo, proyecto_id }
        });
        if (!articulo) {
            throw new NotFoundException('Artículo no encontrado');
        }

        // Crear la actividad
        const nuevaActividad = await this.prismaService.actividad.create({
            data: {
                id: this.uuidService.generate(),
                accion: accion,
                responsable: user.email,
                fecha: new Date(),
                proyecto_id: proyecto_id,
                articulo_id: id_articulo,
            }
        });

        return nuevaActividad;
    }

    async getActividadById(id_usuario: string, id_actividad: string): Promise<ActividadEntity | null> {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: id_usuario }
        });
        const proyecto_id = user?.proyecto_id;
        if (!proyecto_id) {
            throw new NotFoundException('Usuario o proyecto no encontrado');
        }

        const actividad = await this.prismaService.actividad.findUnique({
            where: {
                id: id_actividad,
                proyecto_id
            }
        });

        if (!actividad) {
            throw new NotFoundException('Actividad no encontrada');
        }

        return actividad;
    }

    async getActividadByArticulo(id_usuario: string, id_articulo: string): Promise<ActividadEntity[]> {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: id_usuario }
        });
        const proyecto_id = user?.proyecto_id;
        if (!proyecto_id) {
            throw new NotFoundException('Usuario o proyecto no encontrado');
        }

        return this.prismaService.actividad.findMany({
            where: {
                articulo_id: id_articulo,
                proyecto_id: proyecto_id
            },
            orderBy: {
                fecha: 'desc'
            }
        });
    }

    async getActividadAll(id_usuario: string): Promise<ActividadEntity[]> {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: id_usuario }
        });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const proyecto_id = user.proyecto_id;

        return this.prismaService.actividad.findMany({
            where: {
                proyecto_id
            },
            orderBy: {
                fecha: 'desc'
            }
        });
    }

    async deleteActividad(id_usuario: string, id_actividad: string): Promise<void> {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: id_usuario }
        });
        const proyecto_id = user?.proyecto_id;
        if (!proyecto_id) {
            throw new NotFoundException('Usuario o proyecto no encontrado');
        }

        await this.prismaService.actividad.delete({
            where: {
                id: id_actividad,
                proyecto_id
            }
        });
    }
}
