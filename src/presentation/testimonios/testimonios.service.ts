import { Injectable } from '@nestjs/common';
import { CreateTestimoniosDtoImpl } from './dto/create-testimonios.dto';
import { UpdateTestimoniosDtoImpl } from './dto/update-testimonios.dto';
import { CreateTestimonioDtoImpl } from './dto/create-testimonio.dto';
import { TestimoniosRepositoryService } from 'src/infrastructure';

@Injectable()
export class TestimoniosService {
    constructor(private readonly testimoniosRepository: TestimoniosRepositoryService) {}

    // ─── Testimonios (Entidad padre) ────────────────────────────────────────────

    create(id_usuario: string, createTestimoniosDto: CreateTestimoniosDtoImpl) {
        return this.testimoniosRepository.createSecTestimonios(id_usuario, createTestimoniosDto);
    }

    find(id_usuario: string) {
        return this.testimoniosRepository.getSecTestimonios(id_usuario);
    }

    update(id_usuario: string, updateTestimoniosDto: UpdateTestimoniosDtoImpl) {
        return this.testimoniosRepository.updateSecTestimonios(id_usuario, updateTestimoniosDto);
    }

    // ─── Testimonio (entidad hijo / ítem individual) ────────────────────────────────────────

    createTestimonio(id_usuario: string, createTestimonioDto: CreateTestimonioDtoImpl) {
        return this.testimoniosRepository.createTestimonio(id_usuario, createTestimonioDto);
    }

    removeTestimonio(id_usuario: string, id_testimonio: string) {
        return this.testimoniosRepository.deleteTestimonio(id_usuario, id_testimonio);
    }
}
