import { Module } from '@nestjs/common';
import { ArticuloDatasourceService } from './articulo.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import {UuidModule} from '../../adapters/uuid/uuid.module';

@Module({
  imports: [PrismaModule, UuidModule],
  providers: [ArticuloDatasourceService],
  exports: [ArticuloDatasourceService],
})
export class ArticuloDatasourceModule {}
