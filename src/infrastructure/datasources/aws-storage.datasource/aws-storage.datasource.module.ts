import { Module } from '@nestjs/common';
import { AwsStorageDatasourceService } from './aws-storage.datasource.service';
import { PrismaModule } from 'src/infrastructure/orm/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [AwsStorageDatasourceService],
  exports: [AwsStorageDatasourceService]
})
export class AwsStorageDatasourceModule {}
