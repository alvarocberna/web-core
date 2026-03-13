import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule, ImageStorageRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule, ImageStorageRepositoryModule, ConfigModule],
  controllers: [ArticuloController],
  providers: [ArticuloService],
  exports: [ArticuloService],
})
export class ArticuloModule {}
