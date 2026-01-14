import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { ImageStorageService } from './image-storage.service';
import { ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ArticuloRepositoryModule, SecArticuloRepositoryModule, ActividadRepositoryModule, ConfigModule],
  controllers: [ArticuloController],
  providers: [ArticuloService, ImageStorageService],
  exports: [ArticuloService],
})
export class ArticuloModule {}
