import { Module } from '@nestjs/common';
import { UsuarioDatasourceService } from './usuario.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import {UuidModule} from '../../adapters/uuid/uuid.module';
import { PassHasherModule } from 'src/infrastructure/adapters/pass-hasher/pass-hasher.module';

@Module({
  imports: [PrismaModule, UuidModule, PassHasherModule],
  providers: [UsuarioDatasourceService],
  exports: [UsuarioDatasourceService],
})
export class UsuarioDatasourceModule {}
