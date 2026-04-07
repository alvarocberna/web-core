// import { ArticuloEntity } from "../entities/articulo.entity"
import { EquipoRepository, ActividadRepository, ImageStorageRepository, UsuarioRepository } from "src/domain"
import { NotFoundException } from "@nestjs/common"

interface DeleteEmpleadoUseCaseInterface{
    execute(
        id_usuario: string, 
        id_empleado: string,
    ): Promise<void>
}

export class DeleteEmpleadoUseCase implements DeleteEmpleadoUseCaseInterface{
    constructor(
        private readonly equipoRepository: EquipoRepository,
        // private readonly actividadRepository: ActividadRepository,
        private readonly imageStorageRepository: ImageStorageRepository,
        private readonly usuarioRepository: UsuarioRepository,
    ){}
    public async execute(
        id_usuario: string, 
        id_empleado: string,
    ): Promise<void> {
        //id del proyecto
        const user = await this.usuarioRepository.getUsuarioById(id_usuario)
        if(!user) throw new NotFoundException('usuario de articulo no encontrado')
        const id_proyecto = user.proyecto_id;
        //registramos la actividad en la DB
        // await this.actividadRepository.createActividad(id_usuario, id_empleado, 'eliminado')
        //eliminamos la imagen del storage (bucket S3)
        await this.imageStorageRepository.deleteImage(id_proyecto, id_empleado, 'empleado')
        //eliminamos la data de la base de datos
        await this.equipoRepository.deleteEmpleado(id_usuario, id_empleado);
        return Promise.resolve();   
    }
}