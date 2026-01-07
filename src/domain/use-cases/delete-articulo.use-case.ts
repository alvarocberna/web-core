// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloEntity, ArticuloRepository, ActividadRepository, UpdateArticuloDto} from "src/domain"

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
    ){}
    public async execute(
        id_usuario: string, 
        id_articulo: string,
    ): Promise<void> {
        await this.actividadRepository.createActividad(id_usuario, id_articulo, 'eliminado')
        //entregamos la info al repository para actualizar articulo
        await this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
        //registramos esta accion
        return Promise.resolve();   
    }
}