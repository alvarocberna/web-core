import { ImageEntityType } from 'src/domain';

export abstract class ImageStorageRepository{
    abstract saveImage(file: any): Promise<string>;
    abstract deleteImage(id_usuario: string, id_entidad: string, entityType: ImageEntityType): Promise<void>;
}