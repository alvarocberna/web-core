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
  UpdateServicioOrdenDto,
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

  async createServicios(
    usuarioId: string,
    createServiciosDto: CreateServiciosDto,
  ): Promise<ServiciosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.create({
      data: {
        id: this.uuidService.generate(),
        ...createServiciosDto,
        proyectoId: user.proyectoId,
      },
    });
    return servicios;
  }

  async getServicios(usuarioId: string): Promise<ServiciosEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
      include: {
        servicio: {
          include: { secServicio: true },
          orderBy: { orden: 'asc' },
        },
      },
    });

    return servicios;
  }

  async updateServicios(
    usuarioId: string,
    updateServiciosDto: UpdateServiciosDto,
  ): Promise<ServiciosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    const updated = await this.prismaService.servicios.update({
      where: { id: servicios.id, proyectoId: user.proyectoId },
      data: { ...updateServiciosDto },
    });
    return updated;
  }

  // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

  async createServicio(
    usuarioId: string,
    createServicioDto: CreateServicioDto,
  ): Promise<ServicioEntity> {
    const { secServicio, ...data } = createServicioDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    //buscamos el valor máximo del campo 'orden'
    const result = await this.prismaService.servicio.aggregate({
      where: {
        proyectoId: user.proyectoId,
        serviciosId: servicios.id,
      },
      _max: {
        orden: true,
      },
    });

    const maxOrden = result._max.orden ?? 0;

    data.orden = maxOrden + 1000;

    const servicio = await this.prismaService.servicio.create({
      data: {
        id: this.uuidService.generate(),
        ...data,
        proyectoId: user.proyectoId,
        serviciosId: servicios.id,
        ...(secServicio &&
          secServicio.length > 0 && {
            secServicio: {
              create: secServicio.map((sec, index) => ({
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
      include: { secServicio: true },
    });
    return servicio;
  }

  async getServicio(
    usuarioId: string,
    servicioId: string,
  ): Promise<ServicioEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    const servicio = await this.prismaService.servicio.findUnique({
      where: {
        id: servicioId,
        serviciosId: servicios.id,
        proyectoId: user.proyectoId,
      },
      include: { secServicio: true },
    });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');

    return servicio;
  }

  async updateServicio(
    usuarioId: string,
    servicioId: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<ServicioEntity> {
    const { secServicio, ...data } = updateServicioDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    const servicioOld = await this.prismaService.servicio.findUnique({
      where: {
        id: servicioId,
        serviciosId: servicios.id,
        proyectoId: user.proyectoId,
      },
      include: { secServicio: true },
    });
    if (!servicioOld) throw new NotFoundException('Servicio no encontrado');

    if (servicioOld.imgUrl && !data.imgUrl) {
      data.imgUrl = servicioOld.imgUrl;
    }

    if (secServicio) {
      servicioOld.secServicio.forEach((secOld) => {
        secServicio.forEach((secNew) => {
          if (secNew.id === secOld.id) {
            if (secOld.imageUrl && !secNew.imageUrl) {
              secNew.imageUrl = secOld.imageUrl;
            }
          }
        });
      });
    }

    const updated = await this.prismaService.servicio.update({
      where: { id: servicioId, proyectoId: user.proyectoId },
      data: {
        ...data,
        ...(secServicio && {
          secServicio: {
            deleteMany: {},
            createMany: {
              data: secServicio.map((sec) => ({
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
      include: { secServicio: true },
    });
    return updated;
  }

  async updateServicioOrden(
    usuarioId: string,
    servicioId: string,
    updateServicioOrdenDto: UpdateServicioOrdenDto,
  ): Promise<ServicioEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    const servicio = await this.prismaService.servicio.findUnique({
      where: {
        id: servicioId,
        serviciosId: servicios.id,
        proyectoId: user.proyectoId,
      },
    });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');

    const updated = await this.prismaService.servicio.update({
      where: { id: servicioId, proyectoId: user.proyectoId },
      data: { orden: updateServicioOrdenDto.orden },
      include: { secServicio: true },
    });
    return updated;
  }

  async deleteServicio(usuarioId: string, servicioId: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!servicios) throw new NotFoundException('Servicios no encontrado');

    await this.prismaService.servicio.delete({
      where: {
        id: servicioId,
        serviciosId: servicios.id,
        proyectoId: user.proyectoId,
      },
    });
  }

  // PUBLIC ----------------------------------------------
  async getServiciosPublic(
    proyectoId: string,
  ): Promise<ServiciosEntity | null> {
    const servicios = await this.prismaService.servicios.findFirst({
      where: { proyectoId: proyectoId },
      include: {
        servicio: {
          include: { secServicio: true },
          orderBy: { orden: 'asc' },
        },
      },
    });

    return servicios;
  }
}
