import { Injectable } from '@nestjs/common';
import { CreateServiciosDtoImpl } from './dto/create-servicios.dto';
import { UpdateServiciosDtoImpl } from './dto/update-servicios.dto';
import { CreateServicioDtoImpl } from './dto/create-servicio.dto';
import { UpdateServicioDtoImpl } from './dto/update-servicio.dto';
import { UpdateServicioOrdenDtoImpl } from './dto/update-servicio-orden.dto';
import {
  ServiciosRepositoryService,
  ImageStorageRepositoryService,
} from 'src/infrastructure';
import { UsuarioRepositoryService } from 'src/infrastructure';
import { DeleteServicioUseCase } from 'src/domain';

@Injectable()
export class ServiciosService {
  constructor(
    private readonly serviciosRepository: ServiciosRepositoryService,
    private readonly imageStorage: ImageStorageRepositoryService,
    private readonly usuarioRepository: UsuarioRepositoryService,
  ) {}

  // ─── Servicios (Entidad padre) ───────────────────────────────────────────────

  create(usuarioId: string, createServiciosDto: CreateServiciosDtoImpl) {
    return this.serviciosRepository.createServicios(
      usuarioId,
      createServiciosDto,
    );
  }

  find(usuarioId: string) {
    return this.serviciosRepository.getServicios(usuarioId);
  }

  update(usuarioId: string, updateServiciosDto: UpdateServiciosDtoImpl) {
    return this.serviciosRepository.updateServicios(
      usuarioId,
      updateServiciosDto,
    );
  }

  // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

  async createServicio(
    usuarioId: string,
    createServicioDto: CreateServicioDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    if (files?.imageFile?.[0]) {
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      createServicioDto.imgUrl = imageUrl;
    }

    if (files?.secImages && createServicioDto.secServicio) {
      for (const [index, file] of files.secImages.entries()) {
        if (!createServicioDto.secServicio[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        createServicioDto.secServicio[index].imageUrl = imageUrl;
      }
    }

    return this.serviciosRepository.createServicio(
      usuarioId,
      createServicioDto,
    );
  }

  findServicio(usuarioId: string, servicioId: string) {
    return this.serviciosRepository.getServicio(usuarioId, servicioId);
  }

  async updateServicio(
    usuarioId: string,
    servicioId: string,
    updateServicioDto: UpdateServicioDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const currentServicio = (await this.serviciosRepository.getServicio(
      usuarioId,
      servicioId,
    )) as any;

    if (files?.imageFile?.[0]) {
      if (currentServicio?.imgUrl) {
        await this.imageStorage.deleteImageByUrl(currentServicio.imgUrl);
      }
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      updateServicioDto.imgUrl = imageUrl;
    }

    // Eliminar imágenes de secciones que ya no están en la nueva data
    if (currentServicio?.secServicio?.length) {
      const nuevosIds = new Set(
        (updateServicioDto.secServicio ?? []).map((s) => s.id),
      );
      const seccionesEliminadas = currentServicio.secServicio.filter(
        (s: any) => !nuevosIds.has(s.id),
      );
      await Promise.all(
        seccionesEliminadas
          .filter((s: any) => s.imageUrl)
          .map((s: any) => this.imageStorage.deleteImageByUrl(s.imageUrl)),
      );
    }

    if (files?.secImages && updateServicioDto.secServicio) {
      for (const [index, file] of files.secImages.entries()) {
        if (!updateServicioDto.secServicio[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const seccionId = updateServicioDto.secServicio[index].id;
        const oldSeccion = currentServicio?.secServicio?.find(
          (s: any) => s.id === seccionId,
        );
        if (oldSeccion?.imageUrl) {
          await this.imageStorage.deleteImageByUrl(oldSeccion.imageUrl);
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        updateServicioDto.secServicio[index].imageUrl = imageUrl;
      }
    }

    return this.serviciosRepository.updateServicio(
      usuarioId,
      servicioId,
      updateServicioDto,
    );
  }

  updateServicioOrden(
    usuarioId: string,
    servicioId: string,
    updateServicioOrdenDto: UpdateServicioOrdenDtoImpl,
  ) {
    return this.serviciosRepository.updateServicioOrden(
      usuarioId,
      servicioId,
      updateServicioOrdenDto,
    );
  }

  removeServicio(usuarioId: string, servicioId: string) {
    return new DeleteServicioUseCase(
      this.serviciosRepository,
      this.imageStorage,
      this.usuarioRepository,
    ).execute(usuarioId, servicioId);
    return this.serviciosRepository.deleteServicio(usuarioId, servicioId);
  }

  // PUBLIC -----------------------------------------------------------

  findServiciosPublic(proyectoId: string) {
    return this.serviciosRepository.getServiciosPublic(proyectoId);
  }
}
