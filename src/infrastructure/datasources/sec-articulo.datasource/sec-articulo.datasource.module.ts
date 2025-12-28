import { Module } from '@nestjs/common';
import { SecArticuloDatasourceService } from './sec-articulo.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import {UuidModule} from '../../adapters/uuid/uuid.module'

@Module({
  imports: [PrismaModule, UuidModule],
  providers: [SecArticuloDatasourceService],
  exports: [SecArticuloDatasourceService],
})
export class SecArticuloDatasourceModule {}
