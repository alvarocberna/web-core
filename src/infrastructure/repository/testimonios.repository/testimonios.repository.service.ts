import { Injectable } from '@nestjs/common';
import {
  TestimoniosRepository,
  TestimoniosEntity,
  TestimonioEntity,
  CreateTestimoniosDto,
  UpdateTestimoniosDto,
  CreateTestimonioDto,
  UpdateTestimonioDto,
} from 'src/domain';
import { TestimoniosDatasourceService } from 'src/infrastructure';

@Injectable()
export class TestimoniosRepositoryService implements TestimoniosRepository {
  constructor(
    private readonly testimoniosDatasource: TestimoniosDatasourceService,
  ) {}

  createSecTestimonios(
    usuarioId: string,
    createTestimoniosDto: CreateTestimoniosDto,
  ): Promise<TestimoniosEntity> {
    return this.testimoniosDatasource.createSecTestimonios(
      usuarioId,
      createTestimoniosDto,
    );
  }

  getSecTestimonios(usuarioId: string): Promise<TestimoniosEntity | null> {
    return this.testimoniosDatasource.getSecTestimonios(usuarioId);
  }

  updateSecTestimonios(
    usuarioId: string,
    updateTestimoniosDto: UpdateTestimoniosDto,
  ): Promise<TestimoniosEntity> {
    return this.testimoniosDatasource.updateSecTestimonios(
      usuarioId,
      updateTestimoniosDto,
    );
  }

  createTestimonio(
    usuarioId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity> {
    return this.testimoniosDatasource.createTestimonio(
      usuarioId,
      createTestimonioDto,
    );
  }

  updateTestimonio(
    testimonioId: string,
    updateTestimonioDto: UpdateTestimonioDto,
  ): Promise<TestimonioEntity> {
    return this.testimoniosDatasource.updateTestimonio(
      testimonioId,
      updateTestimonioDto,
    );
  }

  deleteTestimonio(usuarioId: string, testimonioId: string): Promise<void> {
    return this.testimoniosDatasource.deleteTestimonio(usuarioId, testimonioId);
  }

  // ---- public -----------------------------------------------------------

  getSecTestimoniosPublic(
    proyectoId: string,
  ): Promise<TestimoniosEntity | null> {
    return this.testimoniosDatasource.getSecTestimoniosPublic(proyectoId);
  }

  createTestimonioPublic(
    proyectoId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity> {
    return this.testimoniosDatasource.createTestimonioPublic(
      proyectoId,
      createTestimonioDto,
    );
  }
}
