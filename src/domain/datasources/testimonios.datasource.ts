import {
  TestimoniosEntity,
  TestimonioEntity,
  CreateTestimoniosDto,
  UpdateTestimoniosDto,
  CreateTestimonioDto,
  UpdateTestimonioDto,
} from 'src/domain';

export abstract class TestimoniosDatasource {
  abstract createSecTestimonios(
    usuarioId: string,
    createTestimoniosDto: CreateTestimoniosDto,
  ): Promise<TestimoniosEntity>;
  abstract getSecTestimonios(
    usuarioId: string,
  ): Promise<TestimoniosEntity | null>;
  abstract updateSecTestimonios(
    usuarioId: string,
    updateTestimoniosDto: UpdateTestimoniosDto,
  ): Promise<TestimoniosEntity>;

  abstract createTestimonio(
    usuarioId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity>;
  abstract updateTestimonio(
    testimonioId: string,
    updateTestimonioDto: UpdateTestimonioDto,
  ): Promise<TestimonioEntity>;
  abstract deleteTestimonio(
    usuarioId: string,
    testimonioId: string,
  ): Promise<void>;

  //public
  abstract getSecTestimoniosPublic(
    proyectoId: string,
  ): Promise<TestimoniosEntity | null>;
  abstract createTestimonioPublic(
    proyectoId: string,
    createTestimonioDto: CreateTestimonioDto,
  ): Promise<TestimonioEntity>;
}
