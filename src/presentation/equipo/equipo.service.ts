import { Injectable } from '@nestjs/common';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
import { UpdateEmpleadoOrdenDtoImpl } from './dto/update-empleado-orden.dto';
import {
  EquipoRepositoryService,
  ImageStorageRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';
import { DeleteEmpleadoUseCase } from 'src/domain';

@Injectable()
export class EquipoService {
  constructor(
    private readonly equipoRepository: EquipoRepositoryService,
    private readonly imageStorage: ImageStorageRepositoryService,
    private readonly usuarioRepository: UsuarioRepositoryService,
  ) {}

  // ─── Equipo (Entidad padre) ──────────────────────────────────────────────────

  create(usuarioId: string, createEquipoDto: CreateEquipoDtoImpl) {
    return this.equipoRepository.createEquipo(usuarioId, createEquipoDto);
  }

  find(usuarioId: string) {
    return this.equipoRepository.getEquipo(usuarioId);
  }

  update(usuarioId: string, updateEquipoDto: UpdateEquipoDtoImpl) {
    return this.equipoRepository.updateEquipo(usuarioId, updateEquipoDto);
  }

  // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

  async createEmpleado(
    usuarioId: string,
    createEmpleadoDto: CreateEmpleadoDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    if (files?.imageFile?.[0]) {
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      createEmpleadoDto.imgUrl = imageUrl;
    }

    if (files?.secImages && createEmpleadoDto.secEmpleado) {
      for (const [index, file] of files.secImages.entries()) {
        if (!createEmpleadoDto.secEmpleado[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        createEmpleadoDto.secEmpleado[index].imageUrl = imageUrl;
      }
    }

    return this.equipoRepository.createEmpleado(usuarioId, createEmpleadoDto);
  }

  findEmpleado(usuarioId: string, empleadoId: string) {
    return this.equipoRepository.getEmpleado(usuarioId, empleadoId);
  }

  async updateEmpleado(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoDto: UpdateEmpleadoDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const currentEmpleado = (await this.equipoRepository.getEmpleado(
      usuarioId,
      empleadoId,
    )) as any;

    if (files?.imageFile?.[0]) {
      if (currentEmpleado?.imgUrl) {
        await this.imageStorage.deleteImageByUrl(currentEmpleado.imgUrl);
      }
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      updateEmpleadoDto.imgUrl = imageUrl;
    }

    // Eliminar imágenes de secciones que ya no están en la nueva data
    if (currentEmpleado?.secEmpleado?.length) {
      const nuevosIds = new Set(
        (updateEmpleadoDto.secEmpleado ?? []).map((s) => s.id),
      );
      const seccionesEliminadas = currentEmpleado.secEmpleado.filter(
        (s: any) => !nuevosIds.has(s.id),
      );
      await Promise.all(
        seccionesEliminadas
          .filter((s: any) => s.imageUrl)
          .map((s: any) => this.imageStorage.deleteImageByUrl(s.imageUrl)),
      );
    }

    if (files?.secImages && updateEmpleadoDto.secEmpleado) {
      for (const [index, file] of files.secImages.entries()) {
        if (!updateEmpleadoDto.secEmpleado[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const seccionId = updateEmpleadoDto.secEmpleado[index].id;
        const oldSeccion = currentEmpleado?.secEmpleado?.find(
          (s: any) => s.id === seccionId,
        );
        if (oldSeccion?.imageUrl) {
          await this.imageStorage.deleteImageByUrl(oldSeccion.imageUrl);
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        updateEmpleadoDto.secEmpleado[index].imageUrl = imageUrl;
      }
    }

    return this.equipoRepository.updateEmpleado(
      usuarioId,
      empleadoId,
      updateEmpleadoDto,
    );
  }

  updateEmpleadoOrden(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDtoImpl,
  ) {
    return this.equipoRepository.updateEmpleadoOrden(
      usuarioId,
      empleadoId,
      updateEmpleadoOrdenDto,
    );
  }

  removeEmpleado(usuarioId: string, empleadoId: string) {
    return new DeleteEmpleadoUseCase(
      this.equipoRepository,
      this.imageStorage,
      this.usuarioRepository,
    ).execute(usuarioId, empleadoId);
  }

  // PUBLIC --------------------------------------------------------------

  findEquipoPublic(proyectoId: string) {
    return this.equipoRepository.getEquipoPublic(proyectoId);
  }
}
