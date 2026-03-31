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

    async createArticulos(id_usuario: string, createArticulosDto: CreateArticulosDto): Promise<ArticulosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const articulos = await this.prismaService.articulos.create({
            data: {
                id: this.uuidService.generate(),
                ...createArticulosDto,
                proyecto_id: user.proyecto_id,
            },
        });
        return articulos;
    }

    async getArticulos(id_usuario: string): Promise<ArticulosEntity | null> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const articulos = await this.prismaService.articulos.findFirst({
            where: { proyecto_id: user.proyecto_id },
            include: {
                articulo: {
                    include: { sec_articulo: true },
                },
            },
        });
        return articulos;
    }

    async updateArticulos(id_usuario: string, updateArticulosDto: UpdateArticulosDto): Promise<ArticulosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const articulos = await this.prismaService.articulos.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!articulos) throw new NotFoundException('Sección artículos no encontrada');

        const updated = await this.prismaService.articulos.update({
            where: { id: articulos.id },
            data: { ...updateArticulosDto },
        });
        return updated;
    }

    // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

    async createArticulo(id_usuario: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
        const { sec_articulo, ...data } = createArticuloDto;

        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const articulos = await this.prismaService.articulos.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!articulos) throw new NotFoundException('Sección artículos no encontrada');

        const count = await this.prismaService.articulo.count({
            where: { articulos_id: articulos.id },
        });
        const nro_articulo = count + 1;

        const articulo = await this.prismaService.articulo.create({
            data: {
                id: this.uuidService.generate(),
                nro_articulo,
                ...data,
                usuario_id: id_usuario,
                articulos_id: articulos.id,
                sec_articulo: {
                    create: sec_articulo.map((sec, index) => ({
                        id: this.uuidService.generate(),
                        nro_seccion: index + 1,
                        titulo_sec: sec.titulo_sec,
                        contenido_sec: sec.contenido_sec,
                        image_url: sec.image_url,
                        image_alt: sec.image_alt,
                        image_position: sec.image_position,
                    })),
                },
            },
        });
        return articulo;
    }

    async getArticuloById(id_usuario: string, id_articulo: string): Promise<ArticuloEntity | null> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const articulos = await this.prismaService.articulos.findFirst({
            where: { proyecto_id: user.proyecto_id },
        });
        if (!articulos) throw new NotFoundException('Sección artículos no encontrada');

        const articulo = await this.prismaService.articulo.findUnique({
            where: { id: id_articulo, articulos_id: articulos.id },
            include: { sec_articulo: true },
        });
        if (!articulo) throw new NotFoundException('Artículo no encontrado');

        return articulo;
    }

 async updateArticulo(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity> {
        const {sec_articulo, ...data} = updateArticuloDto as UpdateArticuloDto;

        //que no elimine la url antigua
        const data_old = await this.prismaService.articulo.findUnique({ 
            where: { 
                id: id_articulo,
            },
            include: {
                sec_articulo: true
            }
        });
        if(data_old?.image_url && !data.image_url){
            data.image_url = data_old.image_url;
        }
        //lo mismo pero sub sec
        data_old?.sec_articulo.forEach(sec_old => {
            sec_articulo.forEach((sec_new) => {
                if(sec_new.id === sec_old.id){
                    if(sec_old?.image_url && !sec_new?.image_url){
                        sec_new.image_url = sec_old.image_url;
                    }
                }
            })
        })
        const user = await this.prismaService.usuario.findUnique({
            where: {id: id_usuario}
        });
        
        const articulo = await this.prismaService.articulo.update({
            where: { id: id_articulo, usuario_id: id_usuario },
            data: {
                ...data,
                ...(sec_articulo && {
                    sec_articulo: {
                        deleteMany: {},
                        createMany: {
                            data: sec_articulo.map(sec => ({
                                // ...sec,
                                nro_seccion: sec.nro_seccion + 1,
                                titulo_sec: sec.titulo_sec,
                                contenido_sec: sec.contenido_sec,
                                image_url: sec.image_url,
                                image_alt: sec.image_alt,
                                image_position: sec.image_position,
                            }))
                        }
                    }
                })
            },
            include: {
                sec_articulo: true
            }
        });
        return articulo;
    }

    async deleteArticulo(id_usuario: string, id_articulo: string): Promise<void> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        await this.prismaService.articulo.delete({
            where: { id: id_articulo, usuario_id: id_usuario },
            include: {
                sec_articulo: true,
                actividad: false,
            },
        });
    }
}
