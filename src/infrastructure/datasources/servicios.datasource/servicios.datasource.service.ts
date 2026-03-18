//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {
    ServiciosDatasource,
    ServiciosEntity,
    ServicioEntity,
    CreateServiciosDto,
    UpdateServiciosDto,
    CreateServicioDto,
    UpdateServicioDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';

@Injectable()
export class ServiciosDatasourceService implements ServiciosDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService,
    ) {}

    // ─── Servicios (entidad padre) ───────────────────────────────────────────────

    async createServicios(id_usuario: string, createServiciosDto: CreateServiciosDto): Promise<ServiciosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.create({
            data: {
                id: this.uuidService.generate(),
                ...createServiciosDto,
                proyecto_id: user.proyecto_id,
            },
        });
        return servicios;
    }

    async getServicios(id_usuario: string): Promise<ServiciosEntity | null> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
            include: { servicio: true },
        });

        return servicios;
    }

    async updateServicios(id_usuario: string, updateServiciosDto: UpdateServiciosDto): Promise<ServiciosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const updated = await this.prismaService.servicios.update({
            where: { id: servicios.id },
            data: { ...updateServiciosDto },
        });
        return updated;
    }

    // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

    async createServicio(id_usuario: string, createServicioDto: CreateServicioDto): Promise<ServicioEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const servicio = await this.prismaService.servicio.create({
            data: {
                id: this.uuidService.generate(),
                ...createServicioDto,
                servicios_id: servicios.id,
            },
        });
        return servicio;
    }

    async getServicio(id_usuario: string, id_servicio: string): Promise<ServicioEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const servicio = await this.prismaService.servicio.findUnique({
            where: { id: id_servicio, servicios_id: servicios.id },
        });
        if (!servicio) throw new NotFoundException('Servicio no encontrado');

        return servicio;
    }

    async updateServicio(id_usuario: string, id_servicio: string, updateServicioDto: UpdateServicioDto): Promise<ServicioEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const servicio = await this.prismaService.servicio.findUnique({
            where: { id: id_servicio, servicios_id: servicios.id },
        });
        if (!servicio) throw new NotFoundException('Servicio no encontrado');

        const updated = await this.prismaService.servicio.update({
            where: { id: id_servicio },
            data: { ...updateServicioDto },
        });
        return updated;
    }

    async deleteServicio(id_usuario: string, id_servicio: string): Promise<void> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        await this.prismaService.servicio.delete({
            where: { id: id_servicio, servicios_id: servicios.id },
        });
    }
}
