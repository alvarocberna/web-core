//nest
import { Injectable, NotFoundException } from '@nestjs/common';
//domain
import {ArticuloDatasource ,ArticuloEntity, CreateArticuloDto, UpdateArticuloDto} from 'src/domain';
//infrastructure
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import {UuidService} from '../../adapters/uuid/uuid.service';

@Injectable()
export class ArticuloDatasourceService implements ArticuloDatasource {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UuidService
    ) {}

    async createArticulo(id_usuario: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
        //extraemos la data
        const {sec_articulo, ...data} = createArticuloDto;
        //obtenemos al usuario
        const user = await this.prismaService.usuario.findUnique({
            where: {id: id_usuario}
        })
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        const id_proyecto = user.proyecto_id;
        //obtenemos el nro de articulo
        let nro_articulo: number = 1;
        const count: number = await this.prismaService.articulo.count({
            where: {
                proyecto_id: id_proyecto
            }
        })
        if(count == 0){
            nro_articulo = 1;
        }else if (count > 0){
            nro_articulo = count + 1;
        }
        //creamos el articulo
        const articulo = this.prismaService.articulo.create({ 
            data: {
                id: this.uuidService.generate(),
                nro_articulo: nro_articulo,
                ...data,
                proyecto_id: id_proyecto,
                sec_articulo: {
                    create: sec_articulo.map((sec, index) => ({
                        id: this.uuidService.generate(),
                        nro_seccion: index + 1,
                        titulo_sec: sec.titulo_sec,
                        contenido_sec: sec.contenido_sec,
                        image_url: sec.image_url,
                        image_alt: sec.image_alt,
                        image_position: sec.image_position,
                        proyecto_id: id_proyecto,
                    })),
        },
            }
        });
        return articulo;
    }

    async getArticuloById(id_usuario: string, id_articulo: string): Promise<ArticuloEntity | null> {
        const usuario = await this.prismaService.usuario.findUnique({
            where: {id: id_usuario},
            // select: {proyecto_id: true}
        });
        const proyecto_id = usuario?.proyecto_id;
        if(!proyecto_id){
            throw new NotFoundException('Usuario o proyecto no encontrado');
        }
        const articulo = await this.prismaService.articulo.findUnique({ 
            where: { 
                id: id_articulo,
                proyecto_id: proyecto_id
            },
            include: {
                sec_articulo: true
            }
        });
        if (!articulo) {
            throw new NotFoundException('articulo not found');
        }
        return articulo;
    }

    async getAllArticulos(id_usuario: string): Promise<ArticuloEntity[]> {
        const user = await this.prismaService.usuario.findFirst({
            where: {id: id_usuario}
        })
        console.log('id usuario: ' + id_usuario)
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        const id_proyecto = user.proyecto_id;
        console.log('id proyecto: ' + id_proyecto)

        return this.prismaService.articulo.findMany({
                where: {
                    proyecto_id: id_proyecto
                }
            });
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
        const proyecto_id = user?.proyecto_id;
        
        const articulo = await this.prismaService.articulo.update({
            where: { id: id_articulo, autor_id: id_usuario },
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
                                proyecto_id: proyecto_id!
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
        const proyecto_id = user?.proyecto_id;

        if (!proyecto_id) {
            throw new NotFoundException('Usuario o proyecto no encontrado');
        }

        await this.prismaService.articulo.delete({
            where: { id: id_articulo, proyecto_id: proyecto_id },
            include: {
                sec_articulo: true,
                actividad: false,
            }
        });

        return Promise.resolve();

    }
}
