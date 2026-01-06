// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloEntity, ArticuloRepository, ActividadRepository ,CreateArticuloDto } from "src/domain"

interface CreateArticuloUseCaseInterface{
    execute(
        id_usuario: string, 
        createArticuloFullDto: CreateArticuloDto, 
    ): Promise<ArticuloEntity>
}

export class CreateArticuloUseCase implements CreateArticuloUseCaseInterface{
    constructor(
        private readonly articuloRepository: ArticuloRepository,
        private readonly actividadRepository: ActividadRepository,
    ){}
    public async execute(
        id_usuario: string, 
        createArticuloDto: CreateArticuloDto, 
    ): Promise<ArticuloEntity> {
        //creamos el articulo
        const articulo = await this.articuloRepository.createArticulo(id_usuario, createArticuloDto);
        //registramos esta accion
        await this.actividadRepository.createActividad(id_usuario, articulo.id, 'articulo creado')
        //retornamos
        return articulo;   
    }
}