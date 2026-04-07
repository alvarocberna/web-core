// import { ArticuloEntity } from "../entities/articulo.entity"
import { ServiciosRepository, ActividadRepository, ImageStorageRepository, UsuarioRepository } from "src/domain"
import { NotFoundException } from "@nestjs/common"

interface DeleteServicioUseCaseInterface{
    execute(
        id_usuario: string, 
        id_servicio: string,
    ): Promise<void>
}

export class DeleteServicioUseCase implements DeleteServicioUseCaseInterface{
    constructor(
        private readonly serviciosRepository: ServiciosRepository,
        // private readonly actividadRepository: ActividadRepository,
        private readonly imageStorageRepository: ImageStorageRepository,
        private readonly usuarioRepository: UsuarioRepository,
    ){}
    public async execute(
        id_usuario: string, 
        id_servicio: string,
    ): Promise<void> {
        //id del proyecto
        const user = await this.usuarioRepository.getUsuarioById(id_usuario)
        if(!user) throw new NotFoundException('usuario de articulo no encontrado')
        const id_proyecto = user.proyecto_id;
        //registramos la actividad en la DB
        // await this.actividadRepository.createActividad(id_usuario, id_servicio, 'eliminado')
        //eliminamos la imagen del storage (bucket S3)
        await this.imageStorageRepository.deleteImage(id_proyecto, id_servicio, 'servicio')
        //eliminamos la data de la base de datos
        await this.serviciosRepository.deleteServicio(id_usuario, id_servicio);
        return Promise.resolve();   
    }
}