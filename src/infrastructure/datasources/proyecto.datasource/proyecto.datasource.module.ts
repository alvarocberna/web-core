import { Module } from '@nestjs/common';
import { ProyectoDatasourceService } from './proyecto.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProyectoDatasourceService],
  exports: [ProyectoDatasourceService],
})
export class ProyectoDatasourceModule {}
