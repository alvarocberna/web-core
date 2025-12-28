// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloEntity, ArticuloRepository, SecArticuloRepository, CreateArticuloFullDto ,CreateArticuloDto, CreateSecArticuloDto } from "src/domain"

interface CreateArticuloUseCaseInterface{
    execute(
        id_proyecto: string, 
        createArticuloFullDto: CreateArticuloFullDto, 
    ): Promise<ArticuloEntity>
}

export class CreateArticuloUseCase implements CreateArticuloUseCaseInterface{
    constructor(
        private readonly articuloRepository: ArticuloRepository,
        private readonly secArticuloRepository: SecArticuloRepository,
    ){}
    public async execute(
        id_proyecto: string, 
        createArticuloFullDto: CreateArticuloFullDto, 
    ): Promise<ArticuloEntity> {
        //extraemos la información del articulo y sus secciones
        const createArticuloDto = createArticuloFullDto.articulo;
        const createSecArticuloDto = createArticuloFullDto.secArticulo;
        //creamos el articulo
        const articulo = await this.articuloRepository.createArticulo(id_proyecto, createArticuloDto);
        const id_articulo = articulo.id;
        //creamos las secciones del articulo
        await this.secArticuloRepository.createSecArticulo(id_proyecto, id_articulo, createSecArticuloDto);
        return articulo;   
    }
}