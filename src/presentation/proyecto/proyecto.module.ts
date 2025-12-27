import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ProyectoRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ProyectoRepositoryModule],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService]
})
export class ProyectoModule {}
