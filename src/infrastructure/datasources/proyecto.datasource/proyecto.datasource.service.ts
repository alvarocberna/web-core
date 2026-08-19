//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {
  ProyectoDatasource,
  ProyectoEntity,
  CreateProyectoDto,
  UpdateProyectoDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';
// import { prisma } from '../../../../node_modules/prisma'

@Injectable()
export class ProyectoDatasourceService implements ProyectoDatasource {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
  ) {}

  async createProyecto(
    createProyectoDto: CreateProyectoDto,
  ): Promise<ProyectoEntity> {
    const proyecto = this.prismaService.proyecto.create({
      data: {
        id: this.uuidService.generate(),
        nombreProyecto: createProyectoDto.nombreProyecto,
        descripcion: createProyectoDto.descripcion,
        cliente: createProyectoDto.cliente,
        fechaInicio: new Date(),
        activo: createProyectoDto.activo,
      },
    });
    return proyecto;
  }

  async getProyectoById(proyectoId: string): Promise<ProyectoEntity | null> {
    const proyecto = this.prismaService.proyecto.findUnique({
      where: {
        id: proyectoId,
      },
    });
    if (!proyecto) {
      throw new NotFoundException('Proyecto not found');
    }
    return proyecto;
  }

  async getAllProyectos(): Promise<ProyectoEntity[]> {
    return this.prismaService.proyecto.findMany();
  }

  async updateProyecto(
    proyectoId: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<ProyectoEntity> {
    const proyecto = await this.prismaService.proyecto.update({
      where: { id: proyectoId },
      data: { ...updateProyectoDto },
    });
    return proyecto;
  }

  async deleteProyecto(proyectoId: string): Promise<void> {
    await this.prismaService.proyecto.delete({
      where: { id: proyectoId },
    });
  }
}
