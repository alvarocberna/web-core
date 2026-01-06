import { Module } from '@nestjs/common';
import { ActividadDatasourceService } from './actividad.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { UuidModule } from '../../adapters/uuid/uuid.module';

@Module({
  imports: [PrismaModule, UuidModule],
  providers: [ActividadDatasourceService],
  exports: [ActividadDatasourceService],
})
export class ActividadDatasourceModule {}
