import { Module } from '@nestjs/common';
import { TestimoniosService } from './testimonios.service';
import { TestimoniosController } from './testimonios.controller';
import { TestimoniosRepositoryModule } from 'src/infrastructure/repository/testimonios.repository/testimonios.repository.module';

@Module({
    imports: [TestimoniosRepositoryModule],
    controllers: [TestimoniosController],
    providers: [TestimoniosService],
    exports: [TestimoniosService],
})
export class TestimoniosModule {}
