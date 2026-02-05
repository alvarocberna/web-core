// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloRepository, ActividadRepository, ImageStorageRepository } from "src/domain"

interface DeleteArticuloUseCaseInterface{
    execute(
        id_usuario: string, 
        id_articulo: string,
    ): Promise<void>
}

export class DeleteArticuloUseCase implements DeleteArticuloUseCaseInterface{
    constructor(
        private readonly articuloRepository: ArticuloRepository,
        private readonly actividadRepository: ActividadRepository,
        private readonly imageStorageRepository: ImageStorageRepository,
    ){}
    public async execute(
        id_usuario: string, 
        id_articulo: string,
    ): Promise<void> {
        //registramos la actividad en la DB
        await this.actividadRepository.createActividad(id_usuario, id_articulo, 'eliminado')
        //eliminamos la imagen del storage (bucket S3)
        await this.imageStorageRepository.deleteImage(id_usuario, id_articulo)
        //eliminamos la data de la base de datos
        await this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
        return Promise.resolve();   
    }
}