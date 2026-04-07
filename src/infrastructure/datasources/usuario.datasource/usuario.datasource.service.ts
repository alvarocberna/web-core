//nest
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
//domain
import {UsuarioDatasource, UsuarioEntity, CreateUsuarioDto, UpdateUsuarioDto, UpdateUsuarioInfoDto, UpdateUsuarioPasswordDto} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import {UuidService} from '../../adapters/uuid/uuid.service';
import { PassHasherService } from 'src/infrastructure/adapters/pass-hasher/pass-hasher.service';

@Injectable()
export class UsuarioDatasourceService implements UsuarioDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService,
        private readonly passHasherService: PassHasherService
    ) {}

    async createUsuario(id_proyecto: string, createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
        
        const existingUsuario = await this.prismaService.usuario.findFirst({
            where: { 
                email: createUsuarioDto.email,
            }
        });
        if (existingUsuario) {
            throw new BadRequestException(`El correo ${createUsuarioDto.email} ya está en uso para el rol PACIENTE`);
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
                proyecto_id: id_proyecto,
            }
        });
        return usuario;
    }

    async getUsuarioById(id_usuario: string): Promise<UsuarioEntity | null> {
        const usuario = await this.prismaService.usuario.findFirst({
            where: {
                id: id_usuario
            }
        });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }
        return usuario;
    }

    async getUsuarioByEmail(email: string): Promise<UsuarioEntity | null> {
        const usuario = await this.prismaService.usuario.findUnique({
            where: {
                email: email
            }
        });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }
        return usuario;
    }

    async getAllUsuarios(id_proyecto: string): Promise<UsuarioEntity[]> {
        return this.prismaService.usuario.findMany({
            where: {
                proyecto_id: id_proyecto
            }
        });
    }

    async updateUsuario(id_usuario: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
        const { nombre, apellido, email, rol, img_url, img_alt } = updateUsuarioDto;
        
        const usuario = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!usuario) throw new NotFoundException('Usuario not found');

        const update = await this.prismaService.usuario.update({
            where: {
                id: id_usuario,
                proyecto_id: usuario.proyecto_id,
            },
            data: {
                ...(nombre !== undefined && { nombre }),
                ...(apellido !== undefined && { apellido }),
                ...(email !== undefined && { email }),
                ...(rol !== undefined && { rol }),
                ...(img_url !== undefined && { img_url }),
                ...(img_alt !== undefined && { img_alt }),
            },
        });
        return update;
    }

    async updateUsuarioPassword(id_usuario: string, updateUsuarioPasswordDto: UpdateUsuarioPasswordDto): Promise<void> {
        const usuario = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!usuario) throw new NotFoundException('Usuario not found');

        const isPasswordValid = await this.passHasherService.compare(updateUsuarioPasswordDto.currentPassword, usuario.password);
        if (!isPasswordValid) throw new UnauthorizedException('La contraseña actual es incorrecta');

        const hashedPassword = await this.passHasherService.hash(updateUsuarioPasswordDto.newPassword);
        await this.prismaService.usuario.update({
            where: { id: id_usuario, proyecto_id: usuario.proyecto_id },
            data: { password: hashedPassword },
        });
    }

    async deleteUsuario(id_proyecto: string, id_usuario: string): Promise<void> {
        await this.prismaService.usuario.delete({
            where: { 
                id: id_usuario, 
                proyecto_id: id_proyecto 
            },
        });
    }

    async setRefreshToken(id_usuario: string, hashedRt: string) {
        await this.prismaService.usuario.update({ where: { id: id_usuario }, data: { hashedRt }});
    }

    async removeRefreshToken(id_usuario: string) {
        await this.prismaService.usuario.update({ where: { id: id_usuario }, data: { hashedRt: null }});
    }

}
