import { Module } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { ArticuloRepositoryModule, SecArticuloRepositoryModule } from 'src/infrastructure';

@Module({
  imports: [ArticuloRepositoryModule, SecArticuloRepositoryModule],
  controllers: [ArticuloController],
  providers: [ArticuloService],
  exports: [ArticuloService],
})
export class ArticuloModule {}
