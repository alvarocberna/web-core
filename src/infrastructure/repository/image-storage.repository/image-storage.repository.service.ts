import { Injectable } from '@nestjs/common';
import { ImageStorageDatasource, ImageEntityType } from 'src/domain';
import { AwsStorageDatasourceService, LocalStorageDatasourceService } from 'src/infrastructure';

@Injectable()
export class ImageStorageRepositoryService implements ImageStorageDatasource {
    constructor(private readonly imageStorage: AwsStorageDatasourceService ){}

    async saveImage(file: any): Promise<string> {
        return this.imageStorage.saveImage(file);
    }

    async deleteImage(id_usuario: string, id_entidad: string, entityType: ImageEntityType): Promise<void> {
        return this.imageStorage.deleteImage(id_usuario, id_entidad, entityType);
    }
}
