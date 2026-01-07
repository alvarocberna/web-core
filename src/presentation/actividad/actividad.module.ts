import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { ActividadRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ActividadRepositoryModule],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [ActividadService]
})
export class ActividadModule {}
