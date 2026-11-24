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

  async createEquipo(
    usuarioId: string,
    createEquipoDto: CreateEquipoDto,
  ): Promise<EquipoEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.create({
      data: {
        id: this.uuidService.generate(),
        ...createEquipoDto,
        proyectoId: user.proyectoId,
      },
    });
    return equipo;
  }

  async getEquipo(usuarioId: string): Promise<EquipoEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
      include: {
        empleado: {
          include: { secEmpleado: true },
          orderBy: { orden: 'asc' },
        },
      },
    });

    return equipo;
  }

  async updateEquipo(
    usuarioId: string,
    updateEquipoDto: UpdateEquipoDto,
  ): Promise<EquipoEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    const updated = await this.prismaService.equipo.update({
      where: { id: equipo.id, proyectoId: user.proyectoId },
      data: { ...updateEquipoDto },
    });
    return updated;
  }

  // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

  async createEmpleado(
    usuarioId: string,
    createEmpleadoDto: CreateEmpleadoDto,
  ): Promise<EmpleadoEntity> {
    const { secEmpleado, ...data } = createEmpleadoDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    //buscamos el valor máximo del campo 'orden'
    const result = await this.prismaService.empleado.aggregate({
      where: {
        proyectoId: user.proyectoId,
        equipoId: equipo.id,
      },
      _max: {
        orden: true,
      },
    });

    const maxOrden = result._max.orden ?? 0;

    data.orden = maxOrden + 1000;

    const empleado = await this.prismaService.empleado.create({
      data: {
        id: this.uuidService.generate(),
        ...data,
        proyectoId: user.proyectoId,
        equipoId: equipo.id,
        ...(secEmpleado &&
          secEmpleado.length > 0 && {
            secEmpleado: {
              create: secEmpleado.map((sec, index) => ({
                id: this.uuidService.generate(),
                nroSeccion: index + 1,
                tituloSec: sec.tituloSec,
                contenidoSec: sec.contenidoSec,
                imageUrl: sec.imageUrl,
                imageAlt: sec.imageAlt,
                imagePosition: sec.imagePosition,
                proyectoId: user.proyectoId,
              })),
            },
          }),
      },
      include: { secEmpleado: true },
    });
    return empleado;
  }

  async getEmpleado(
    usuarioId: string,
    empleadoId: string,
  ): Promise<EmpleadoEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    const empleado = await this.prismaService.empleado.findUnique({
      where: {
        id: empleadoId,
        equipoId: equipo.id,
        proyectoId: user.proyectoId,
      },
      include: { secEmpleado: true },
    });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    return empleado;
  }

  async updateEmpleado(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<EmpleadoEntity> {
    const { secEmpleado, ...data } = updateEmpleadoDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    const empleadoOld = await this.prismaService.empleado.findUnique({
      where: {
        id: empleadoId,
        equipoId: equipo.id,
        proyectoId: user.proyectoId,
      },
      include: { secEmpleado: true },
    });
    if (!empleadoOld) throw new NotFoundException('Empleado no encontrado');

    if (empleadoOld.imgUrl && !data.imgUrl) {
      data.imgUrl = empleadoOld.imgUrl;
    }

    if (secEmpleado) {
      empleadoOld.secEmpleado.forEach((secOld) => {
        secEmpleado.forEach((secNew) => {
          if (secNew.id === secOld.id) {
            if (secOld.imageUrl && !secNew.imageUrl) {
              secNew.imageUrl = secOld.imageUrl;
            }
          }
        });
      });
    }

    const updated = await this.prismaService.empleado.update({
      where: { id: empleadoId, proyectoId: user.proyectoId },
      data: {
        ...data,
        ...(secEmpleado && {
          secEmpleado: {
            deleteMany: {},
            createMany: {
              data: secEmpleado.map((sec) => ({
                nroSeccion: sec.nroSeccion + 1,
                tituloSec: sec.tituloSec,
                contenidoSec: sec.contenidoSec,
                imageUrl: sec.imageUrl,
                imageAlt: sec.imageAlt,
                imagePosition: sec.imagePosition,
                proyectoId: user.proyectoId,
              })),
            },
          },
        }),
      },
      include: { secEmpleado: true },
    });
    return updated;
  }

  async updateEmpleadoOrden(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDto,
  ): Promise<EmpleadoEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    const empleado = await this.prismaService.empleado.findUnique({
      where: {
        id: empleadoId,
        equipoId: equipo.id,
        proyectoId: user.proyectoId,
      },
    });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    const updated = await this.prismaService.empleado.update({
      where: { id: empleadoId, proyectoId: user.proyectoId },
      data: { orden: updateEmpleadoOrdenDto.orden },
      include: { secEmpleado: true },
    });
    return updated;
  }

  async deleteEmpleado(usuarioId: string, empleadoId: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    await this.prismaService.empleado.delete({
      where: {
        id: empleadoId,
        equipoId: equipo.id,
        proyectoId: user.proyectoId,
      },
    });
  }

  // PUBLIC ----------------------------------------------------------------

  async getEquipoPublic(proyectoId: string): Promise<EquipoEntity | null> {
    const equipo = await this.prismaService.equipo.findFirst({
      where: { proyectoId: proyectoId },
      include: {
        empleado: {
          include: { secEmpleado: true },
          orderBy: { orden: 'asc' },
        },
      },
    });

    return equipo;
  }
}
