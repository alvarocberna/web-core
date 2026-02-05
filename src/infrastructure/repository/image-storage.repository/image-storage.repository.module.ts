import { Module } from '@nestjs/common';
import { ImageStorageRepositoryService } from './image-storage.repository.service';
import { AwsStorageDatasourceModule, LocalStorageDatasourceModule } from 'src/infrastructure';

@Module({
  imports: [AwsStorageDatasourceModule, LocalStorageDatasourceModule],
  providers: [ImageStorageRepositoryService],
  exports: [ImageStorageRepositoryService],
})
export class ImageStorageRepositoryModule {}
