//nest
import { Injectable } from '@nestjs/common';
//domain
import {UsuarioRepository, UsuarioEntity, CreateUsuarioDto, UpdateUsuarioDto, UpdateUsuarioInfoDto, UpdateUsuarioPasswordDto} from 'src/domain';
//infrastructure
import { UsuarioDatasourceService } from 'src/infrastructure/datasources/usuario.datasource/usuario.datasource.service';

@Injectable()
export class UsuarioRepositoryService implements UsuarioRepository{
    constructor(
        private readonly usuarioDatasource: UsuarioDatasourceService
    ){}

    async createUsuario(id_proyecto: string, createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
        return this.usuarioDatasource.createUsuario(id_proyecto, createUsuarioDto)
    }

    async getUsuarioById(id_usuario: string): Promise<UsuarioEntity | null> {
        return this.usuarioDatasource.getUsuarioById(id_usuario)
    }

    async getUsuarioByEmail(email: string): Promise<UsuarioEntity | null> {
        return this.usuarioDatasource.getUsuarioByEmail(email)
    }

    async getAllUsuarios(id_proyecto: string): Promise<UsuarioEntity[]> {
        return this.usuarioDatasource.getAllUsuarios(id_proyecto)
    }

    async updateUsuario(id_proyecto: string, id_usuario: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
        return this.usuarioDatasource.updateUsuario(id_proyecto, id_usuario, updateUsuarioDto)
    }
    
    async updateUsuarioInfo(id_usuario: string, updateUsuarioInfoDto: UpdateUsuarioInfoDto): Promise<UsuarioEntity> {
        return this.usuarioDatasource.updateUsuarioInfo(id_usuario, updateUsuarioInfoDto);
    }

    async updateUsuarioPassword(id_usuario: string, updateUsuarioPasswordDto: UpdateUsuarioPasswordDto): Promise<void> {
        return this.usuarioDatasource.updateUsuarioPassword(id_usuario, updateUsuarioPasswordDto);
    }

    async deleteUsuario(id_proyecto: string, id_usuario: string): Promise<void> {
        return this.usuarioDatasource.deleteUsuario(id_proyecto, id_usuario)
    }

    async setRefreshToken(id_usuario: string, hashedRt: string) {
        await this.usuarioDatasource.setRefreshToken(id_usuario, hashedRt);
    }

    async removeRefreshToken(id_usuario: string) {
        await this.usuarioDatasource.removeRefreshToken(id_usuario);
    }

}
