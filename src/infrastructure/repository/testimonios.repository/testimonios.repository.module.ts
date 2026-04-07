import { Module } from '@nestjs/common';
import { TestimoniosRepositoryService } from './testimonios.repository.service';
import { TestimoniosDatasourceModule } from 'src/infrastructure/datasources/testimonios.datasource/testimonios.datasource.module';

@Module({
    imports: [TestimoniosDatasourceModule],
    providers: [TestimoniosRepositoryService],
    exports: [TestimoniosRepositoryService],
})
export class TestimoniosRepositoryModule {}
