// import { ArticuloEntity } from "../entities/articulo.entity"
import {
  ServiciosRepository,
  ActividadRepository,
  ImageStorageRepository,
  UsuarioRepository,
} from 'src/domain';
import { NotFoundException } from '@nestjs/common';

interface DeleteServicioUseCaseInterface {
  execute(usuarioId: string, servicioId: string): Promise<void>;
}

export class DeleteServicioUseCase implements DeleteServicioUseCaseInterface {
  constructor(
    private readonly serviciosRepository: ServiciosRepository,
    // private readonly actividadRepository: ActividadRepository,
    private readonly imageStorageRepository: ImageStorageRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  public async execute(usuarioId: string, servicioId: string): Promise<void> {
    //id del proyecto
    const user = await this.usuarioRepository.getUsuarioById(usuarioId);
    if (!user) throw new NotFoundException('usuario de articulo no encontrado');
    const proyectoId = user.proyectoId;
    //registramos la actividad en la DB
    // await this.actividadRepository.createActividad(usuarioId, servicioId, 'eliminado')
    //eliminamos la imagen del storage (bucket S3)
    await this.imageStorageRepository.deleteImage(
      proyectoId,
      servicioId,
      'servicio',
    );
    //eliminamos la data de la base de datos
    await this.serviciosRepository.deleteServicio(usuarioId, servicioId);
    return Promise.resolve();
  }
}
