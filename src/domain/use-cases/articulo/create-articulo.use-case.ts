// import { ArticuloEntity } from "../entities/articulo.entity"
import {
  ArticuloEntity,
  ArticuloRepository,
  ActividadRepository,
  CreateArticuloDto,
} from 'src/domain';

interface CreateArticuloUseCaseInterface {
  execute(
    usuarioId: string,
    createArticuloFullDto: CreateArticuloDto,
  ): Promise<ArticuloEntity>;
}

//test: se debe crear una instancia de la clase caso de uso
export class CreateArticuloUseCase implements CreateArticuloUseCaseInterface {
  //test: tenemos inyecciópn de dependencias, x lo q se debe inicializar en el test
  constructor(
    private readonly articuloRepository: ArticuloRepository,
    private readonly actividadRepository: ActividadRepository,
  ) {}
  public async execute(
    usuarioId: string,
    createArticuloDto: CreateArticuloDto,
  ): Promise<ArticuloEntity> {
    //creamos el articulo
    const articulo = await this.articuloRepository.createArticulo(
      usuarioId,
      createArticuloDto,
    );
    //registramos esta accion
    await this.actividadRepository.createActividad(
      usuarioId,
      articulo.id,
      'creado',
    );
    //retornamos
    return articulo;
  }
}
