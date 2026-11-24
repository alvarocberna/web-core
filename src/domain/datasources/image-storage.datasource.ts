export type ImageEntityType = 'articulo' | 'servicio' | 'empleado';

export abstract class ImageStorageDatasource {
  abstract saveImage(file: any): Promise<string>;
  abstract deleteImage(
    usuarioId: string,
    entidadId: string,
    entityType: ImageEntityType,
  ): Promise<void>;
  abstract deleteImageByUrl(imageUrl: string): Promise<void>;
}
