//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {
    EquipoDatasource,
    EquipoEntity,
    EmpleadoEntity,
    CreateEquipoDto,
    UpdateEquipoDto,
    CreateEmpleadoDto,
    UpdateEmpleadoDto,
    UpdateEmpleadoOrdenDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';

@Injectable()
export class EquipoDatasourceService implements EquipoDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService,
    ) {}

    // ─── Equipo (entidad padre) ──────────────────────────────────────────────────

    async createEquipo(id_usuario: string, createEquipoDto: CreateEquipoDto): Promise<EquipoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.create({
            data: {
                id: this.uuidService.generate(),
                ...createEquipoDto,
                proyecto_id: user.proyecto_id,
            },
        });
        return equipo;
    }

    async getEquipo(id_usuario: string): Promise<EquipoEntity | null> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
            include: {
                empleado: {
                    include: { sec_empleado: true },
                    orderBy: { orden: 'asc' },
                },
            },
        });

        return equipo;
    }

    async updateEquipo(id_usuario: string, updateEquipoDto: UpdateEquipoDto): Promise<EquipoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const updated = await this.prismaService.equipo.update({
            where: { id: equipo.id, proyecto_id: user.proyecto_id },
            data: { ...updateEquipoDto },
        });
        return updated;
    }

    // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

    async createEmpleado(id_usuario: string, createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        const { sec_empleado, ...data } = createEmpleadoDto;

        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        //buscamos el valor máximo del campo 'orden'
        const result = await this.prismaService.empleado.aggregate({
        where: {
            proyecto_id: user.proyecto_id, 
            equipo_id: equipo.id,
        },
        _max: {
            orden: true,
        },
        });

        const maxOrden = result._max.orden ?? 0;
        
        data.orden = maxOrden +  1000;

        const empleado = await this.prismaService.empleado.create({
            data: {
                id: this.uuidService.generate(),
                ...data,
                proyecto_id: user.proyecto_id,
                equipo_id: equipo.id,
                ...(sec_empleado && sec_empleado.length > 0 && {
                    sec_empleado: {
                        create: sec_empleado.map((sec, index) => ({
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
            include: { sec_empleado: true },
        });
        return empleado;
    }

    async getEmpleado(id_usuario: string, id_empleado: string): Promise<EmpleadoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const empleado = await this.prismaService.empleado.findUnique({
            where: { id: id_empleado, equipo_id: equipo.id, proyecto_id: user.proyecto_id },
            include: { sec_empleado: true },
        });
        if (!empleado) throw new NotFoundException('Empleado no encontrado');

        return empleado;
    }

    async updateEmpleado(id_usuario: string, id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
        const { sec_empleado, ...data } = updateEmpleadoDto as UpdateEmpleadoDto;

        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const empleado_old = await this.prismaService.empleado.findUnique({
            where: { id: id_empleado, equipo_id: equipo.id, proyecto_id: user.proyecto_id },
            include: { sec_empleado: true },
        });
        if (!empleado_old) throw new NotFoundException('Empleado no encontrado');

        if (empleado_old.img_url && !data.img_url) {
            data.img_url = empleado_old.img_url;
        }

        if (sec_empleado) {
            empleado_old.sec_empleado.forEach(sec_old => {
                sec_empleado.forEach(sec_new => {
                    if (sec_new.id === sec_old.id) {
                        if (sec_old.image_url && !sec_new.image_url) {
                            sec_new.image_url = sec_old.image_url;
                        }
                    }
                });
            });
        }

        const updated = await this.prismaService.empleado.update({
            where: { id: id_empleado, proyecto_id: user.proyecto_id },
            data: {
                ...data,
                ...(sec_empleado && {
                    sec_empleado: {
                        deleteMany: {},
                        createMany: {
                            data: sec_empleado.map(sec => ({
                                nro_seccion: sec.nro_seccion + 1,
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
            include: { sec_empleado: true },
        });
        return updated;
    }

    async updateEmpleadoOrden(id_usuario: string, id_empleado: string, updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDto): Promise<EmpleadoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const empleado = await this.prismaService.empleado.findUnique({
            where: { id: id_empleado, equipo_id: equipo.id, proyecto_id: user.proyecto_id },
        });
        if (!empleado) throw new NotFoundException('Empleado no encontrado');

        const updated = await this.prismaService.empleado.update({
            where: { id: id_empleado, proyecto_id: user.proyecto_id },
            data: { orden: updateEmpleadoOrdenDto.orden },
            include: { sec_empleado: true },
        });
        return updated;
    }

    async deleteEmpleado(id_usuario: string, id_empleado: string): Promise<void> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        await this.prismaService.empleado.delete({
            where: { id: id_empleado, equipo_id: equipo.id, proyecto_id: user.proyecto_id },
        });
    }
}
