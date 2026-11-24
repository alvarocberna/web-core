import { Injectable } from '@nestjs/common';
import { ImageStorageDatasource, ImageEntityType } from 'src/domain';
import {
  AwsStorageDatasourceService,
  LocalStorageDatasourceService,
} from 'src/infrastructure';

@Injectable()
export class ImageStorageRepositoryService implements ImageStorageDatasource {
  constructor(private readonly imageStorage: AwsStorageDatasourceService) {}

  async saveImage(file: any): Promise<string> {
    return this.imageStorage.saveImage(file);
  }

  async deleteImage(
    usuarioId: string,
    entidadId: string,
    entityType: ImageEntityType,
  ): Promise<void> {
    return this.imageStorage.deleteImage(usuarioId, entidadId, entityType);
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    return this.imageStorage.deleteImageByUrl(imageUrl);
  }
}
