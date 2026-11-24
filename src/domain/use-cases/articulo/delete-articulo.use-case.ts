// import { ArticuloEntity } from "../entities/articulo.entity"
import { NotFoundException } from '@nestjs/common';
import {
  ArticuloRepository,
  ActividadRepository,
  ImageStorageRepository,
  UsuarioRepository,
} from 'src/domain';

interface DeleteArticuloUseCaseInterface {
  execute(usuarioId: string, articuloId: string): Promise<void>;
}

export class DeleteArticuloUseCase implements DeleteArticuloUseCaseInterface {
  constructor(
    private readonly articuloRepository: ArticuloRepository,
    private readonly actividadRepository: ActividadRepository,
    private readonly imageStorageRepository: ImageStorageRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  public async execute(usuarioId: string, articuloId: string): Promise<void> {
    //id del proyecto
    const user = await this.usuarioRepository.getUsuarioById(usuarioId);
    if (!user) throw new NotFoundException('usuario de articulo no encontrado');
    const proyectoId = user.proyectoId;
    //registramos la actividad en la DB
    await this.actividadRepository.createActividad(
      usuarioId,
      articuloId,
      'eliminado',
    );
    //eliminamos la imagen del storage (bucket S3)
    await this.imageStorageRepository.deleteImage(
      proyectoId,
      articuloId,
      'articulo',
    );
    //eliminamos la data de la base de datos
    await this.articuloRepository.deleteArticulo(usuarioId, articuloId);
    return Promise.resolve();
  }
}
