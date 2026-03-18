import { Module } from '@nestjs/common';
import { EquipoDatasourceService } from './equipo.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { UuidModule } from '../../adapters/uuid/uuid.module';

@Module({
    imports: [PrismaModule, UuidModule],
    providers: [EquipoDatasourceService],
    exports: [EquipoDatasourceService],
})
export class EquipoDatasourceModule {}
