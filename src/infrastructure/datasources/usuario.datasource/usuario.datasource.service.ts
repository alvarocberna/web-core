//nest
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
//domain
import {
  UsuarioDatasource,
  UsuarioEntity,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioInfoDto,
  UpdateUsuarioPasswordDto,
} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { UuidService } from '../../adapters/uuid/uuid.service';
import { PassHasherService } from 'src/infrastructure/adapters/pass-hasher/pass-hasher.service';

@Injectable()
export class UsuarioDatasourceService implements UsuarioDatasource {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly passHasherService: PassHasherService,
  ) {}

  async createUsuario(
    proyectoId: string,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioEntity> {
    const existingUsuario = await this.prismaService.usuario.findFirst({
      where: {
        email: createUsuarioDto.email,
      },
    });
    if (existingUsuario) {
      throw new BadRequestException(
        `El correo ${createUsuarioDto.email} ya está en uso para el rol PACIENTE`,
      );
    }

    const usuario = await this.prismaService.usuario.create({
      data: {
        id: this.uuidService.generate(),
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        email: createUsuarioDto.email,
        fechaCreacion: new Date(),
        password: await this.passHasherService.hash(createUsuarioDto.password),
        hashedRt: null,
        rol: createUsuarioDto.rol,
        proyectoId: proyectoId,
      },
    });
    return usuario;
  }

  async getUsuarioById(usuarioId: string): Promise<UsuarioEntity | null> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario not found');
    }
    return usuario;
  }

  async getUsuarioByEmail(email: string): Promise<UsuarioEntity | null> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        email: email,
      },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario not found');
    }
    return usuario;
  }

  async getAllUsuarios(proyectoId: string): Promise<UsuarioEntity[]> {
    return this.prismaService.usuario.findMany({
      where: {
        proyectoId: proyectoId,
      },
    });
  }

  async updateUsuario(
    usuarioId: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioEntity> {
    const { nombre, apellido, email, rol, imgUrl, imgAlt } = updateUsuarioDto;

    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario not found');

    const update = await this.prismaService.usuario.update({
      where: {
        id: usuarioId,
        proyectoId: usuario.proyectoId,
      },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(apellido !== undefined && { apellido }),
        ...(email !== undefined && { email }),
        ...(rol !== undefined && { rol }),
        ...(imgUrl !== undefined && { imgUrl }),
        ...(imgAlt !== undefined && { imgAlt }),
      },
    });
    return update;
  }

  async updateUsuarioPassword(
    usuarioId: string,
    updateUsuarioPasswordDto: UpdateUsuarioPasswordDto,
  ): Promise<void> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario not found');

    const isPasswordValid = await this.passHasherService.compare(
      updateUsuarioPasswordDto.currentPassword,
      usuario.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('La contraseña actual es incorrecta');

    const hashedPassword = await this.passHasherService.hash(
      updateUsuarioPasswordDto.newPassword,
    );
    await this.prismaService.usuario.update({
      where: { id: usuarioId, proyectoId: usuario.proyectoId },
      data: { password: hashedPassword },
    });
  }

  async deleteUsuario(proyectoId: string, usuarioId: string): Promise<void> {
    await this.prismaService.usuario.delete({
      where: {
        id: usuarioId,
        proyectoId: proyectoId,
      },
    });
  }

  async setRefreshToken(usuarioId: string, hashedRt: string) {
    await this.prismaService.usuario.update({
      where: { id: usuarioId },
      data: { hashedRt },
    });
  }

  async removeRefreshToken(usuarioId: string) {
    await this.prismaService.usuario.update({
      where: { id: usuarioId },
      data: { hashedRt: null },
    });
  }
}
