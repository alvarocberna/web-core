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
    constructor(private readonly testimoniosDatasource: TestimoniosDatasourceService) {}

    createSecTestimonios(id_usuario: string, createTestimoniosDto: CreateTestimoniosDto): Promise<TestimoniosEntity> {
        return this.testimoniosDatasource.createSecTestimonios(id_usuario, createTestimoniosDto);
    }

    getSecTestimonios(id_usuario: string): Promise<TestimoniosEntity | null> {
        return this.testimoniosDatasource.getSecTestimonios(id_usuario);
    }

    updateSecTestimonios(id_usuario: string, updateTestimoniosDto: UpdateTestimoniosDto): Promise<TestimoniosEntity> {
        return this.testimoniosDatasource.updateSecTestimonios(id_usuario, updateTestimoniosDto);
    }

    createTestimonio(id_usuario: string, createTestimonioDto: CreateTestimonioDto): Promise<TestimonioEntity> {
        return this.testimoniosDatasource.createTestimonio(id_usuario, createTestimonioDto);
    }

    updateTestimonio(id_testimonio: string, updateTestimonioDto: UpdateTestimonioDto): Promise<TestimonioEntity> {
        return this.testimoniosDatasource.updateTestimonio(id_testimonio, updateTestimonioDto);
    }

    deleteTestimonio(id_usuario: string, id_testimonio: string): Promise<void> {
        return this.testimoniosDatasource.deleteTestimonio(id_usuario, id_testimonio);
    }
}
