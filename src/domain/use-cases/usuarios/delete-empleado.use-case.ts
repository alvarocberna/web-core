// import { ArticuloEntity } from "../entities/articulo.entity"
import {
  EquipoRepository,
  ActividadRepository,
  ImageStorageRepository,
  UsuarioRepository,
} from 'src/domain';
import { NotFoundException } from '@nestjs/common';

interface DeleteEmpleadoUseCaseInterface {
  execute(usuarioId: string, empleadoId: string): Promise<void>;
}

export class DeleteEmpleadoUseCase implements DeleteEmpleadoUseCaseInterface {
  constructor(
    private readonly equipoRepository: EquipoRepository,
    // private readonly actividadRepository: ActividadRepository,
    private readonly imageStorageRepository: ImageStorageRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  public async execute(usuarioId: string, empleadoId: string): Promise<void> {
    //id del proyecto
    const user = await this.usuarioRepository.getUsuarioById(usuarioId);
    if (!user) throw new NotFoundException('usuario de articulo no encontrado');
    const proyectoId = user.proyectoId;
    //registramos la actividad en la DB
    // await this.actividadRepository.createActividad(usuarioId, empleadoId, 'eliminado')
    //eliminamos la imagen del storage (bucket S3)
    await this.imageStorageRepository.deleteImage(
      proyectoId,
      empleadoId,
      'empleado',
    );
    //eliminamos la data de la base de datos
    await this.equipoRepository.deleteEmpleado(usuarioId, empleadoId);
    return Promise.resolve();
  }
}
