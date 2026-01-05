// import { ArticuloEntity } from "../entities/articulo.entity"
import { ArticuloEntity, ArticuloRepository, SecArticuloRepository, UpdateArticuloDto} from "src/domain"

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
    ){}
    public async execute(
        id_usuario: string, 
        id_articulo: string,
        updateArticuloDto: UpdateArticuloDto, 
    ): Promise<ArticuloEntity> {

        //entregamos la info al repository para actualizar articulo
        const articulo = await this.articuloRepository.updateArticulo(id_usuario, id_articulo, updateArticuloDto);
        return articulo;   
    }
}