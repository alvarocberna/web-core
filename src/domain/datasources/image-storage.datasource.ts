
export type ImageEntityType = 'articulo' | 'servicio' | 'empleado';

export abstract class ImageStorageDatasource{
    abstract saveImage(file: any): Promise<string>;
    abstract deleteImage(id_usuario: string, id_entidad: string, entityType: ImageEntityType): Promise<void>;
}