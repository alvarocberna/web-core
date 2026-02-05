import { Module } from '@nestjs/common';
import { LocalStorageDatasourceService } from './local-storage.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [LocalStorageDatasourceService],
  exports: [LocalStorageDatasourceService],
})
export class LocalStorageDatasourceModule {}
