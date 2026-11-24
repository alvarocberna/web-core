import { ImageEntityType } from 'src/domain';

export abstract class ImageStorageRepository {
  abstract saveImage(file: any): Promise<string>;
  abstract deleteImage(
    usuarioId: string,
    entidadId: string,
    entityType: ImageEntityType,
  ): Promise<void>;
  abstract deleteImageByUrl(imageUrl: string): Promise<void>;
}
