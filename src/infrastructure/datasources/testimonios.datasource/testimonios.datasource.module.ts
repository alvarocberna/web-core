import { Module } from '@nestjs/common';
import { TestimoniosDatasourceService } from './testimonios.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { UuidModule } from '../../adapters/uuid/uuid.module';

@Module({
    imports: [PrismaModule, UuidModule],
    providers: [TestimoniosDatasourceService],
    exports: [TestimoniosDatasourceService],
})
export class TestimoniosDatasourceModule {}
