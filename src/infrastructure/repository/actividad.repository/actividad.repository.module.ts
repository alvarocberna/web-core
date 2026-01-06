import { Module } from '@nestjs/common';
import { ActividadRepositoryService } from './actividad.repository.service';
import { ActividadDatasourceModule } from '../../datasources/actividad.datasource/actividad.datasource.module';

@Module({
  imports: [ActividadDatasourceModule],
  providers: [ActividadRepositoryService],
  exports: [ActividadRepositoryService],
})
export class ActividadRepositoryModule {}
