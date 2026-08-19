import { Injectable } from '@nestjs/common';
import { CreateTestimoniosDtoImpl } from './dto/create-testimonios.dto';
import { UpdateTestimoniosDtoImpl } from './dto/update-testimonios.dto';
import { CreateTestimonioDtoImpl } from './dto/create-testimonio.dto';
import { UpdateTestimonioDtoImpl } from './dto/update-testimonio.dto';
import { TestimoniosRepositoryService } from 'src/infrastructure';

@Injectable()
export class TestimoniosService {
  constructor(
    private readonly testimoniosRepository: TestimoniosRepositoryService,
  ) {}

  // ─── Testimonios (Entidad padre) ────────────────────────────────────────────

  create(usuarioId: string, createTestimoniosDto: CreateTestimoniosDtoImpl) {
    return this.testimoniosRepository.createSecTestimonios(
      usuarioId,
      createTestimoniosDto,
    );
  }

  find(usuarioId: string) {
    return this.testimoniosRepository.getSecTestimonios(usuarioId);
  }

  update(usuarioId: string, updateTestimoniosDto: UpdateTestimoniosDtoImpl) {
    return this.testimoniosRepository.updateSecTestimonios(
      usuarioId,
      updateTestimoniosDto,
    );
  }

  // ─── Testimonio (entidad hijo / ítem individual) ────────────────────────────────────────

  createTestimonio(
    usuarioId: string,
    createTestimonioDto: CreateTestimonioDtoImpl,
  ) {
    return this.testimoniosRepository.createTestimonio(
      usuarioId,
      createTestimonioDto,
    );
  }

  updateTestimonio(
    testimonioId: string,
    updateTestimonioDto: UpdateTestimonioDtoImpl,
  ) {
    return this.testimoniosRepository.updateTestimonio(
      testimonioId,
      updateTestimonioDto,
    );
  }

  removeTestimonio(usuarioId: string, testimonioId: string) {
    return this.testimoniosRepository.deleteTestimonio(usuarioId, testimonioId);
  }

  // ------ PUBLIC -------------------------------------------------------------------
  findTestimoniosPublic(proyectoId: string) {
    return this.testimoniosRepository.getSecTestimoniosPublic(proyectoId);
  }

  createTestimonioPublic(
    proyectoId: string,
    createTestimonioDto: CreateTestimonioDtoImpl,
  ) {
    return this.testimoniosRepository.createTestimonioPublic(
      proyectoId,
      createTestimonioDto,
    );
  }
}
