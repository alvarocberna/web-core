import { Module } from '@nestjs/common';
import { ServiciosDatasourceService } from './servicios.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { UuidModule } from '../../adapters/uuid/uuid.module';

@Module({
    imports: [PrismaModule, UuidModule],
    providers: [ServiciosDatasourceService],
    exports: [ServiciosDatasourceService],
})
export class ServiciosDatasourceModule {}
