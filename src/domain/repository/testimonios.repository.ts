import { TestimoniosEntity, TestimonioEntity, CreateTestimoniosDto, UpdateTestimoniosDto, CreateTestimonioDto, UpdateTestimonioDto } from 'src/domain';

export abstract class TestimoniosRepository {
    abstract createSecTestimonios(id_usuario: string, createTestimoniosDto: CreateTestimoniosDto): Promise<TestimoniosEntity>;
    abstract getSecTestimonios(id_usuario: string): Promise<TestimoniosEntity | null>;
    abstract updateSecTestimonios(id_usuario: string, updateTestimoniosDto: UpdateTestimoniosDto): Promise<TestimoniosEntity>;

    abstract createTestimonio(id_usuario: string, createTestimonioDto: CreateTestimonioDto): Promise<TestimonioEntity>;
    abstract deleteTestimonio(id_usuario: string, id_testimonio: string): Promise<void>;
}
