// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloRepository, ActividadRepository, ImageStorageRepository, UsuarioRepository} from "src/domain"
import { ArticuloEntity, UpdateArticuloDto} from "src/domain"
import { NotFoundException } from "@nestjs/common"

interface UpdateArticuloUseCaseInterface{
    execute(
        id_usuario: string, 
        id_articulo: string,
        updateArticuloDto: UpdateArticuloDto, 
    ): Promise<ArticuloEntity>
}

export class UpdateArticuloUseCase implements UpdateArticuloUseCaseInterface{
    constructor(
        private readonly articuloRepository: ArticuloRepository,
        private readonly actividadRepository: ActividadRepository,
    ){}
    public async execute(
        id_usuario: string, 
        id_articulo: string,
        updateArticuloDto: UpdateArticuloDto, 
    ): Promise<ArticuloEntity> {
        //entregamos la info al repository para actualizar articulo
        const articulo = await this.articuloRepository.updateArticulo(id_usuario, id_articulo, updateArticuloDto);
        //registramos esta accion
        await this.actividadRepository.createActividad(id_usuario, articulo.id, 'modificado')
        return articulo;   
    }
}