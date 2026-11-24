//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {
  TestimoniosDatasource,
  TestimoniosEntity,
  TestimonioEntity,
  CreateTestimoniosDto,
  UpdateTestimoniosDto,
  CreateTestimonioDto,
  UpdateTestimonioDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';

@Injectable()
export class TestimoniosDatasourceService implements TestimoniosDatasource {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
  ) {}

  // ─── Testimonios (entidad padre) ────────────────────────────────────────────

  async createSecTestimonios(
    usuarioId: string,
    createTestimoniosDto: CreateTestimoniosDto,
  ): Promise<TestimoniosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const testimonios = await this.prismaService.testimonios.create({
      data: {
        id: this.uuidService.generate(),
        ...createTestimoniosDto,
        proyectoId: user.proyectoId,
      },
    });
    return testimonios;
  }

  async getSecTestimonios(
    usuarioId: string,
  ): Promise<TestimoniosEntity | null> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const secTestimonios = this.prismaService.testimonios.findFirst({
      where: {
        proyectoId: user.proyectoId,
      },
      include: {
        testimonio: {
          orderBy: { fechaCreacion: 'desc' },
        },
      },
    });

    if (!secTestimonios) {
      throw new NotFoundException('');
    }

    return secTestimonios;
  }

  async updateSecTestimonios(
    usuarioId: string,
    updateTestimoniosDto: UpdateTestimoniosDto,
  ): Promise<TestimoniosEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const testimonios = await this.prismaService.testimonios.findFirst({
      where: { proyectoId: user.proyectoId },
    });
    if (!testimonios) throw new NotFoundException('Testimonios no encontrados');

    const updated = await this.prismaService.testimonios.update({
      where: {
        id: testimonios.id,
        proyectoId: user.proyectoId,
      },
      data: { ...updateTestimoniosDto },
    });
    return updated;
  }

  // ─── Testimonio (entidad hijo / ítem individual) ────────────────────────────────────────

  async createTestimonio(
    usuarioId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const proyectoId = usuario.proyectoId;

    const secTestimonios = await this.prismaService.testimonios.findFirst({
      where: { proyectoId: proyectoId },
    });
    if (!secTestimonios)
      throw new NotFoundException('sec testimonios no encontrada');

    const testimonio = await this.prismaService.testimonio.create({
      data: {
        id: this.uuidService.generate(),
        ...createTestimonioDto,
        fechaCreacion: new Date(),
        proyectoId: usuario.proyectoId,
        testimoniosId: secTestimonios.id,
      },
    });
    return testimonio;
  }

  async updateTestimonio(
    testimonioId: string,
    updateTestimonioDto: UpdateTestimonioDto,
  ): Promise<TestimonioEntity> {
    const testimonio = await this.prismaService.testimonio.findUnique({
      where: { id: testimonioId },
    });
    if (!testimonio) {
      throw new NotFoundException('Testimonio no encontrado');
    }

    const update = await this.prismaService.testimonio.update({
      where: {
        id: testimonioId,
        proyectoId: testimonio.proyectoId,
      },
      data: {
        ...(updateTestimonioDto.status !== undefined && {
          status: updateTestimonioDto.status,
        }),
      },
    });
    return update;
  }

  async deleteTestimonio(
    usuarioId: string,
    testimonioId: string,
  ): Promise<void> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const proyectoId = usuario.proyectoId;

    const secTestimonios = await this.prismaService.testimonios.findFirst({
      where: { proyectoId: proyectoId },
    });
    if (!secTestimonios) {
      throw new NotFoundException('seccion testimonios no encontrado');
    }
    await this.prismaService.testimonio.delete({
      where: {
        id: testimonioId,
        testimoniosId: secTestimonios.id,
        proyectoId: usuario.proyectoId,
      },
    });
  }

  // PUBLIC ------------------------------------------------

  async getSecTestimoniosPublic(
    proyectoId: string,
  ): Promise<TestimoniosEntity | null> {
    const secTestimonios = this.prismaService.testimonios.findFirst({
      where: {
        proyectoId: proyectoId,
      },
      include: {
        testimonio: {
          orderBy: { fechaCreacion: 'desc' },
        },
      },
    });

    if (!secTestimonios) {
      throw new NotFoundException('');
    }

    return secTestimonios;
  }

  async createTestimonioPublic(
    proyectoId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity> {
    const secTestimonios = await this.prismaService.testimonios.findFirst({
      where: { proyectoId: proyectoId },
    });
    if (!secTestimonios)
      throw new NotFoundException('sec testimonios no encontrada');

    const testimonio = await this.prismaService.testimonio.create({
      data: {
        id: this.uuidService.generate(),
        ...createTestimonioDto,
        fechaCreacion: new Date(),
        proyectoId: proyectoId,
        testimoniosId: secTestimonios.id,
      },
    });
    return testimonio;
  }
}
