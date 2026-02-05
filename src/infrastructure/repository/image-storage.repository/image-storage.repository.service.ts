import { Injectable } from '@nestjs/common';
import { ImageStorageDatasource } from 'src/domain';
import { AwsStorageDatasourceService, LocalStorageDatasourceService } from 'src/infrastructure';

@Injectable()
export class ImageStorageRepositoryService implements ImageStorageDatasource {
    constructor(private readonly imageStorage: AwsStorageDatasourceService ){}

    async saveImage(file: any): Promise<string> {
        return this.imageStorage.saveImage(file);
    }

    async deleteImage(id_usuario: string, id_articulo: string): Promise<void> {
        return this.imageStorage.deleteImage(id_usuario, id_articulo);
    }
}
