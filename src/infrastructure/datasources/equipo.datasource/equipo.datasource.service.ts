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
            include: { empleado: true },
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
            where: { id: equipo.id },
            data: { ...updateEquipoDto },
        });
        return updated;
    }

    // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

    async createEmpleado(id_usuario: string, createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const empleado = await this.prismaService.empleado.create({
            data: {
                id: this.uuidService.generate(),
                ...createEmpleadoDto,
                equipo_id: equipo.id,
            },
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
            where: { id: id_empleado, equipo_id: equipo.id },
        });
        if (!empleado) throw new NotFoundException('Empleado no encontrado');

        return empleado;
    }

    async updateEmpleado(id_usuario: string, id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const equipo = await this.prismaService.equipo.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        const empleado = await this.prismaService.empleado.findUnique({
            where: { id: id_empleado, equipo_id: equipo.id },
        });
        if (!empleado) throw new NotFoundException('Empleado no encontrado');

        const updated = await this.prismaService.empleado.update({
            where: { id: id_empleado },
            data: { ...updateEmpleadoDto },
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
            where: { id: id_empleado, equipo_id: equipo.id },
        });
    }
}
