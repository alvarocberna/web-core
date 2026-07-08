// import { ArticuloEntity } from "../entities/articulo.entity"
import { NotFoundException } from "@nestjs/common"
import { ArticuloRepository, ActividadRepository, ImageStorageRepository, UsuarioRepository } from "src/domain"

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
        private readonly usuarioRepository: UsuarioRepository,
    ){}
    public async execute(
        id_usuario: string, 
        id_articulo: string,
    ): Promise<void> {
        //id del proyecto
        const user = await this.usuarioRepository.getUsuarioById(id_usuario)
        if(!user) throw new NotFoundException('usuario de articulo no encontrado')
        const id_proyecto = user.proyecto_id;
        //registramos la actividad en la DB
        await this.actividadRepository.createActividad(id_usuario, id_articulo, 'eliminado')
        //eliminamos la imagen del storage (bucket S3)
        await this.imageStorageRepository.deleteImage(id_proyecto, id_articulo, 'articulo')
        //eliminamos la data de la base de datos
        await this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
        return Promise.resolve();   
    }
}