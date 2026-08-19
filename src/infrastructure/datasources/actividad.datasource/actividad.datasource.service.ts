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
    private readonly uuidService: UuidService,
  ) {}

  async createActividad(
    usuarioId: string,
    articuloId: string,
    accion: string,
  ): Promise<ActividadEntity> {
    // Obtener el usuario y validar
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar que el artículo exista
    const articulo = await this.prismaService.articulo.findUnique({
      where: {
        id: articuloId,
        proyectoId: user.proyectoId,
      },
    });
    if (!articulo) {
      throw new NotFoundException('Artículo no encontrado');
    }

    // Crear la actividad
    const actividad = await this.prismaService.actividad.create({
      data: {
        id: this.uuidService.generate(),
        accion: accion,
        tituloArticulo: articulo.titulo,
        responsable: user.email,
        fecha: new Date(),
        articuloId: articuloId,
        proyectoId: user.proyectoId,
      },
    });

    return actividad;
  }

  async getActividadById(
    usuarioId: string,
    actividadId: string,
  ): Promise<ActividadEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    const proyectoId = user?.proyectoId;
    if (!proyectoId) {
      throw new NotFoundException('Usuario o proyecto no encontrado');
    }

    const actividad = await this.prismaService.actividad.findUnique({
      where: {
        id: actividadId,
        proyectoId: user.proyectoId,
      },
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return actividad;
  }

  async getActividadByArticulo(
    usuarioId: string,
    articuloId: string,
  ): Promise<ActividadEntity[]> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    const proyectoId = user?.proyectoId;
    if (!proyectoId) {
      throw new NotFoundException('Usuario o proyecto no encontrado');
    }

    return this.prismaService.actividad.findMany({
      where: {
        articuloId: articuloId,
        proyectoId: proyectoId,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async getActividadAll(usuarioId: string): Promise<ActividadEntity[]> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prismaService.actividad.findMany({
      where: {
        proyectoId: user.proyectoId,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async deleteActividad(
    usuarioId: string,
    actividadId: string,
  ): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    const proyectoId = user?.proyectoId;
    if (!proyectoId) {
      throw new NotFoundException('Usuario o proyecto no encontrado');
    }

    await this.prismaService.actividad.delete({
      where: {
        id: actividadId,
        proyectoId: user.proyectoId,
      },
    });
  }
}
