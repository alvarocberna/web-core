import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ProyectoRepositoryModule, EquipoRepositoryModule, ServiciosRepositoryModule, ArticuloRepositoryModule, TestimoniosRepositoryModule, UsuarioRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [
    ProyectoRepositoryModule,
    EquipoRepositoryModule,
    ServiciosRepositoryModule,
    ArticuloRepositoryModule,
    TestimoniosRepositoryModule,
    UsuarioRepositoryModule,
  ],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService]
})
export class ProyectoModule {}
