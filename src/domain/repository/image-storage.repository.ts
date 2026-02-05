
export abstract class ImageStorageRepository{
    abstract saveImage(file: any): Promise<string>;
    abstract deleteImage(id_usuario: string, id_articulo: string): Promise<void>;
}