import { Module } from '@nestjs/common';
import { ArticuloRepositoryService } from './articulo.repository.service';
import { ArticuloDatasourceModule } from '../../datasources/articulo.datasource/articulo.datasource.module';

@Module({
  imports: [ArticuloDatasourceModule],
  providers: [ArticuloRepositoryService],
  exports: [ArticuloRepositoryService],
})
export class ArticuloRepositoryModule {}
