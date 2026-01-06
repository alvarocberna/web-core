import { Module } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule],
  controllers: [ArticuloController],
  providers: [ArticuloService],
  exports: [ArticuloService],
})
export class ArticuloModule {}
