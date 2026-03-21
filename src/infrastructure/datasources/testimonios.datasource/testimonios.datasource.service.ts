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

    async createSecTestimonios(id_usuario: string, createTestimoniosDto: CreateTestimoniosDto): Promise<TestimoniosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const testimonios = await this.prismaService.testimonios.create({
            data: {
                id: this.uuidService.generate(),
                ...createTestimoniosDto,
                proyecto_id: user.proyecto_id,
            },
        });
        return testimonios;
    }

    async getSecTestimonios(id_usuario: string): Promise<TestimoniosEntity | null> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const secTestimonios = this.prismaService.testimonios.findFirst({
            where: { 
                proyecto_id: user.proyecto_id 
            },
            include: {
               testimonio: true
            }
        });

        if(!secTestimonios){
            throw new NotFoundException('')
        }

        return secTestimonios;
    }

    async updateSecTestimonios(id_usuario: string, updateTestimoniosDto: UpdateTestimoniosDto): Promise<TestimoniosEntity> {
        const user = await this.prismaService.usuario.findUnique({ where: { id: id_usuario } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const testimonios = await this.prismaService.testimonios.findFirst({
            where: { proyecto_id: user.proyecto_id }
        });
        if (!testimonios) throw new NotFoundException('Testimonios no encontrados');

        const updated = await this.prismaService.testimonios.update({
            where: { 
                id: testimonios.id
            },
            data: { ...updateTestimoniosDto },
        });
        return updated;
    }

    // ─── Testimonio (entidad hijo / ítem individual) ────────────────────────────────────────

    async createTestimonio(id_usuario: string, createTestimonioDto: CreateTestimonioDto): Promise<TestimonioEntity> {
        const usuario = await this.prismaService.usuario.findUnique({where: {id: id_usuario} })
        if(!usuario){
            throw new NotFoundException('Usuario no encontrado')
        }
        const proyecto_id = usuario.proyecto_id;

        const secTestimonios = await this.prismaService.testimonios.findFirst({ where: { proyecto_id: proyecto_id } });
        if (!secTestimonios) throw new NotFoundException('sec testimonios no encontrada');

        const testimonio = await this.prismaService.testimonio.create({
            data: {
                id: this.uuidService.generate(),
                ...createTestimonioDto,
                fecha_creacion: new Date(),
                testimonios_id: secTestimonios.id,
            },
        });
        return testimonio;
    }

    async deleteTestimonio(id_usuario: string, id_testimonio: string): Promise<void> {
        const usuario = await this.prismaService.usuario.findUnique({where: {id: id_usuario}})
        if(!usuario){
            throw new NotFoundException('Usuario no encontrado')
        }
        const proyecto_id = usuario.proyecto_id;

        const secTestimonios = await this.prismaService.testimonios.findFirst({where: {proyecto_id: proyecto_id}})
        if(!secTestimonios){
            throw new NotFoundException('seccion testimonios no encontrado')
        }
        await this.prismaService.testimonio.delete({
            where: { id: id_testimonio, testimonios_id: secTestimonios.id },
        });
    }
}
