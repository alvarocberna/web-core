import { Injectable } from '@nestjs/common';
import { CreateArticulosDtoImpl } from './dto/create-articulos.dto';
import { UpdateArticulosDtoImpl } from './dto/update-articulos.dto';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
//domain
import {
  CreateArticuloUseCase,
  UpdateArticuloUseCase,
  DeleteArticuloUseCase,
} from 'src/domain';
//infrastructure
import {
  ArticuloRepositoryService,
  ActividadRepositoryService,
  ImageStorageRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';

@Injectable()
export class ArticuloService {
  constructor(
    private readonly articuloRepository: ArticuloRepositoryService,
    private readonly actividadRepository: ActividadRepositoryService,
    private readonly imageStorage: ImageStorageRepositoryService,
    private readonly usuarioRepository: UsuarioRepositoryService,
  ) {}

  // ─── Articulos (entidad padre) ────────────────────────────────────────────

  createArticulos(
    usuarioId: string,
    createArticulosDto: CreateArticulosDtoImpl,
  ) {
    return this.articuloRepository.createArticulos(
      usuarioId,
      createArticulosDto,
    );
  }

  findArticulos(usuarioId: string) {
    return this.articuloRepository.getArticulos(usuarioId);
  }

  updateArticulos(
    usuarioId: string,
    updateArticulosDto: UpdateArticulosDtoImpl,
  ) {
    return this.articuloRepository.updateArticulos(
      usuarioId,
      updateArticulosDto,
    );
  }

  // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

  async createArticulo(
    usuarioId: string,
    createArticuloDto: CreateArticuloDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    // Procesar imagen principal del artículo si existe
    if (files?.imageFile?.[0]) {
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      createArticuloDto.imageUrl = imageUrl;
    }

    // Procesar imágenes de las secciones si existen
    if (files?.secImages && createArticuloDto.secArticulo) {
      for (const [index, file] of files.secImages.entries()) {
        if (!createArticuloDto.secArticulo[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        createArticuloDto.secArticulo[index].imageUrl = imageUrl;
      }
    }

    return new CreateArticuloUseCase(
      this.articuloRepository,
      this.actividadRepository,
    ).execute(usuarioId, createArticuloDto);
  }

  findArticuloById(usuarioId: string, articuloId: string) {
    return this.articuloRepository.getArticuloById(usuarioId, articuloId);
  }

  async updateArticulo(
    usuarioId: string,
    articuloId: string,
    updateArticuloDto: UpdateArticuloDtoImpl,
    files?: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const currentArticulo = (await this.articuloRepository.getArticuloById(
      usuarioId,
      articuloId,
    )) as any;

    // Procesar imagen principal del artículo si existe
    if (files?.imageFile?.[0]) {
      if (currentArticulo?.imageUrl) {
        await this.imageStorage.deleteImageByUrl(currentArticulo.imageUrl);
      }
      const imageUrl = await this.imageStorage.saveImage(files.imageFile[0]);
      updateArticuloDto.imageUrl = imageUrl;
    }

    // Eliminar imágenes de secciones que ya no están en la nueva data
    if (currentArticulo?.secArticulo?.length) {
      const nuevosIds = new Set(
        (updateArticuloDto.secArticulo ?? []).map((s) => s.id),
      );
      const seccionesEliminadas = currentArticulo.secArticulo.filter(
        (s: any) => !nuevosIds.has(s.id),
      );
      await Promise.all(
        seccionesEliminadas
          .filter((s: any) => s.imageUrl)
          .map((s: any) => this.imageStorage.deleteImageByUrl(s.imageUrl)),
      );
    }

    // Procesar imágenes de las secciones si existen
    if (files?.secImages && updateArticuloDto.secArticulo) {
      for (const [index, file] of files.secImages.entries()) {
        if (!updateArticuloDto.secArticulo[index]) continue;

        if (typeof file.size === 'number') {
          if (file.size === 0) continue;
        } else if (file.buffer) {
          if (file.buffer.length === 0) continue;
        } else {
          continue;
        }

        const seccionId = updateArticuloDto.secArticulo[index].id;
        const oldSeccion = currentArticulo?.secArticulo?.find(
          (s: any) => s.id === seccionId,
        );
        if (oldSeccion?.imageUrl) {
          await this.imageStorage.deleteImageByUrl(oldSeccion.imageUrl);
        }

        const imageUrl = await this.imageStorage.saveImage(file);
        updateArticuloDto.secArticulo[index].imageUrl = imageUrl;
      }
    }

    return new UpdateArticuloUseCase(
      this.articuloRepository,
      this.actividadRepository,
    ).execute(usuarioId, articuloId, updateArticuloDto);
  }

  updateArticuloStatus(
    usuarioId: string,
    articuloId: string,
    data: { status: string },
  ) {
    return this.articuloRepository.updateArticuloStatus(
      usuarioId,
      articuloId,
      data,
    );
  }

  deleteArticulo(usuarioId: string, articuloId: string) {
    return new DeleteArticuloUseCase(
      this.articuloRepository,
      this.actividadRepository,
      this.imageStorage,
      this.usuarioRepository,
    ).execute(usuarioId, articuloId);
  }

  //PUBLIC

  findArticulosPublic(proyectoId: string) {
    return this.articuloRepository.getArticulosPublic(proyectoId);
  }

  findArticuloByIdPublic(proyectoId: string, articuloId: string) {
    return this.articuloRepository.getArticuloByIdPublic(
      proyectoId,
      articuloId,
    );
  }
}
