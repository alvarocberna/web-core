import { Module } from '@nestjs/common';
import { SecArticuloRepositoryService } from './sec-articulo.repository.service';
import { SecArticuloDatasourceModule } from 'src/infrastructure/datasources/sec-articulo.datasource/sec-articulo.datasource.module';

@Module({
  imports: [SecArticuloDatasourceModule],
  providers: [SecArticuloRepositoryService],
  exports: [SecArticuloRepositoryService]
})
export class SecArticuloRepositoryModule {}
