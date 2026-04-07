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
            include: {
                servicio: {
                    include: { sec_servicio: true },
                },
            },
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
            where: { id: servicios.id, proyecto_id: user.proyecto_id },
            data: { ...updateServiciosDto },
        });
        return updated;
    }

    // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

    async createServicio(id_usuario: string, createServicioDto: CreateServicioDto): Promise<ServicioEntity> {
        const { sec_servicio, ...data } = createServicioDto;

        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const servicio = await this.prismaService.servicio.create({
            data: {
                id: this.uuidService.generate(),
                ...data,
                proyecto_id: user.proyecto_id,
                servicios_id: servicios.id,
                ...(sec_servicio && sec_servicio.length > 0 && {
                    sec_servicio: {
                        create: sec_servicio.map((sec, index) => ({
                            id: this.uuidService.generate(),
                            nro_seccion: index + 1,
                            titulo_sec: sec.titulo_sec,
                            contenido_sec: sec.contenido_sec,
                            image_url: sec.image_url,
                            image_alt: sec.image_alt,
                            image_position: sec.image_position,
                            proyecto_id: user.proyecto_id,
                        })),
                    },
                }),
            },
            include: { sec_servicio: true },
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
            where: { id: id_servicio, servicios_id: servicios.id, proyecto_id: user.proyecto_id },
            include: { sec_servicio: true },
        });
        if (!servicio) throw new NotFoundException('Servicio no encontrado');

        return servicio;
    }

    async updateServicio(id_usuario: string, id_servicio: string, updateServicioDto: UpdateServicioDto): Promise<ServicioEntity> {
        const { sec_servicio, ...data } = updateServicioDto as UpdateServicioDto;

        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const servicios = await this.prismaService.servicios.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!servicios) throw new NotFoundException('Servicios no encontrado');

        const servicio_old = await this.prismaService.servicio.findUnique({
            where: { id: id_servicio, servicios_id: servicios.id, proyecto_id: user.proyecto_id },
            include: { sec_servicio: true },
        });
        if (!servicio_old) throw new NotFoundException('Servicio no encontrado');

        if (servicio_old.img_url && !data.img_url) {
            data.img_url = servicio_old.img_url;
        }

        if (sec_servicio) {
            servicio_old.sec_servicio.forEach(sec_old => {
                sec_servicio.forEach(sec_new => {
                    if (sec_new.id === sec_old.id) {
                        if (sec_old.image_url && !sec_new.image_url) {
                            sec_new.image_url = sec_old.image_url;
                        }
                    }
                });
            });
        }

        const updated = await this.prismaService.servicio.update({
            where: { id: id_servicio, proyecto_id: user.proyecto_id },
            data: {
                ...data,
                ...(sec_servicio && {
                    sec_servicio: {
                        deleteMany: {},
                        createMany: {
                            data: sec_servicio.map(sec => ({
                                nro_seccion: sec.nro_seccion,
                                titulo_sec: sec.titulo_sec,
                                contenido_sec: sec.contenido_sec,
                                image_url: sec.image_url,
                                image_alt: sec.image_alt,
                                image_position: sec.image_position,
                                proyecto_id: user.proyecto_id,
                            })),
                        },
                    },
                }),
            },
            include: { sec_servicio: true },
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
            where: { id: id_servicio, servicios_id: servicios.id, proyecto_id: user.proyecto_id },
        });
    }
}
