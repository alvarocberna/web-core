//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {
  ArticuloDatasource,
  ArticulosEntity,
  ArticuloEntity,
  CreateArticulosDto,
  UpdateArticulosDto,
  CreateArticuloDto,
  UpdateArticuloDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';

@Injectable()
export class ArticuloDatasourceService implements ArticuloDatasource {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
  ) {}

  // ─── Articulos (entidad padre) ────────────────────────────────────────────

  async createArticulos(
    usuarioId: string,
    createArticulosDto: CreateArticulosDto,
  ): Promise<ArticulosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.create({
      data: {
        id: this.uuidService.generate(),
        ...createArticulosDto,
        proyectoId: user.proyectoId,
      },
    });
    return articulos;
  }

  async getArticulos(usuarioId: string): Promise<ArticulosEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: user.proyectoId },
      include: {
        articulo: {
          include: { secArticulo: true },
          orderBy: { fechaPublicacion: 'desc' },
        },
      },
    });
    return articulos;
  }

  async updateArticulos(
    usuarioId: string,
    updateArticulosDto: UpdateArticulosDto,
  ): Promise<ArticulosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!articulos)
      throw new NotFoundException('Sección artículos no encontrada');

    const updated = await this.prismaService.articulos.update({
      where: { id: articulos.id, proyectoId: user.proyectoId },
      data: { ...updateArticulosDto },
    });
    return updated;
  }

  // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

  async createArticulo(
    usuarioId: string,
    createArticuloDto: CreateArticuloDto,
  ): Promise<ArticuloEntity> {
    const { secArticulo, ...data } = createArticuloDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!articulos)
      throw new NotFoundException('Sección artículos no encontrada');

    const count = await this.prismaService.articulo.count({
      where: { articulosId: articulos.id },
    });
    const nroArticulo = count + 1;

    const articulo = await this.prismaService.articulo.create({
      data: {
        id: this.uuidService.generate(),
        nroArticulo,
        ...data,
        proyectoId: user.proyectoId,
        articulosId: articulos.id,
        secArticulo: {
          create: secArticulo.map((sec, index) => ({
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
      },
    });
    return articulo;
  }

  async getArticuloById(
    usuarioId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!articulos)
      throw new NotFoundException('Sección artículos no encontrada');

    const articulo = await this.prismaService.articulo.findUnique({
      where: {
        id: articuloId,
        articulosId: articulos.id,
        proyectoId: user.proyectoId,
      },
      include: { secArticulo: true },
    });
    if (!articulo) throw new NotFoundException('Artículo no encontrado');

    return articulo;
  }

  async updateArticulo(
    usuarioId: string,
    articuloId: string,
    updateArticuloDto: UpdateArticuloDto,
  ): Promise<ArticuloEntity> {
    const { secArticulo, ...data } = updateArticuloDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!articulos) throw new NotFoundException('Articulo no encontrado');

    const articuloOld = await this.prismaService.articulo.findUnique({
      where: {
        id: articuloId,
        articulosId: articulos.id,
        proyectoId: user.proyectoId,
      },
      include: { secArticulo: true },
    });
    if (!articuloOld) throw new NotFoundException('articulo no encontrado');

    if (articuloOld.imageUrl && !data.imageUrl) {
      data.imageUrl = articuloOld.imageUrl;
    }

    if (secArticulo) {
      articuloOld.secArticulo.forEach((secOld) => {
        secArticulo.forEach((secNew) => {
          if (secNew.id === secOld.id) {
            if (secOld.imageUrl && !secNew.imageUrl) {
              secNew.imageUrl = secOld.imageUrl;
            }
          }
        });
      });
    }

    const updated = await this.prismaService.articulo.update({
      where: { id: articuloId, proyectoId: user.proyectoId },
      data: {
        ...data,
        ...(secArticulo && {
          secArticulo: {
            deleteMany: {},
            createMany: {
              data: secArticulo.map((sec) => ({
                nroSeccion: sec.nroSeccion! + 1,
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
      include: { secArticulo: true },
    });
    return updated;
  }

  async updateArticuloStatus(
    usuarioId: string,
    articuloId: string,
    data: { status: string },
  ): Promise<ArticuloEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return await this.prismaService.articulo.update({
      where: { id: articuloId, proyectoId: user.proyectoId },
      data: {
        status: data.status,
      },
    });
  }

  async deleteArticulo(usuarioId: string, articuloId: string): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.prismaService.articulo.delete({
      where: { id: articuloId, proyectoId: user.proyectoId },
      include: {
        secArticulo: true,
        actividad: false,
      },
    });
  }

  // Articulos Public ------------------------------------------------------------

  async getArticulosPublic(
    proyectoId: string,
  ): Promise<ArticulosEntity | null> {
    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: proyectoId },
      include: {
        articulo: {
          include: { secArticulo: true },
          orderBy: { fechaPublicacion: 'desc' },
        },
      },
    });
    return articulos;
  }

  async getArticuloByIdPublic(
    proyectoId: string,
    articuloId: string,
  ): Promise<ArticuloEntity | null> {
    const articulos = await this.prismaService.articulos.findFirst({
      where: { proyectoId: proyectoId },
    });
    if (!articulos)
      throw new NotFoundException('Sección artículos no encontrada');

    const articulo = await this.prismaService.articulo.findUnique({
      where: {
        id: articuloId,
        articulosId: articulos.id,
        proyectoId: proyectoId,
      },
      include: { secArticulo: true },
    });
    if (!articulo) throw new NotFoundException('Artículo no encontrado');

    return articulo;
  }
}
