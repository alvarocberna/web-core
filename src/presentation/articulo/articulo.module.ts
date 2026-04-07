import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { ArticuloRepositoryModule, ActividadRepositoryModule, ImageStorageRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ArticuloRepositoryModule, ActividadRepositoryModule, ImageStorageRepositoryModule, ConfigModule],
  controllers: [ArticuloController],
  providers: [ArticuloService],
  exports: [ArticuloService],
})
export class ArticuloModule {}
