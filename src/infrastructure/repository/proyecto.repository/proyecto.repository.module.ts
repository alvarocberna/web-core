import { Module } from '@nestjs/common';
import { ProyectoRepositoryService } from './proyecto.repository.service';
import { ProyectoDatasourceModule } from '../../datasources/proyecto.datasource/proyecto.datasource.module';

@Module({
  imports: [ProyectoDatasourceModule],
  providers: [ProyectoRepositoryService],
  exports: [ProyectoRepositoryService],
})
export class ProyectoRepositoryModule {}
