import { Delete, Injectable } from '@nestjs/common';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
import { ImageStorageService } from './image-storage.service';
//domain
import {CreateArticuloUseCase, UpdateArticuloUseCase, DeleteArticuloUseCase} from 'src/domain';
//infrastructure
import { ArticuloRepositoryService, ActividadRepositoryService } from 'src/infrastructure';

@Injectable()
export class ArticuloService {

  constructor(
    private readonly articuloRepository: ArticuloRepositoryService,
    private readonly actividadRepository: ActividadRepositoryService,
    private readonly imageStorage: ImageStorageService,
  ){}

  create(
    id_usuario: string, 
    createArticuloDto: CreateArticuloDtoImpl,
    files?: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    }
  ) {
    // Procesar imagen principal del artículo si existe
    if (files?.image_file?.[0]) {
      const imageUrl = this.imageStorage.saveImage(files.image_file[0]);
      createArticuloDto.image_url = imageUrl;
    }

    // Procesar imágenes de las secciones si existen
    // if (files?.sec_images && createArticuloDto.sec_articulo) {
    //   files.sec_images.forEach((file, index) => {
    //     if (createArticuloDto.sec_articulo[index]) {
    //       const imageUrl = this.imageStorage.saveImage(file);
    //       createArticuloDto.sec_articulo[index].image_url = imageUrl;
    //     }
    //   });
    // }
    // Procesar imágenes de las secciones si existen
    if (files?.sec_images && createArticuloDto.sec_articulo) {
      files.sec_images.forEach((file, index) => {
        if (!createArticuloDto.sec_articulo[index]) return;

        // Ignorar placeholders/archivos vacíos
        if (typeof file.size === 'number') {
          if (file.size === 0) return;
        } else if (file.buffer) {
          if ((file.buffer as Buffer).length === 0) return;
        } else {
          return;
        }

        const imageUrl = this.imageStorage.saveImage(file);
        createArticuloDto.sec_articulo[index].image_url = imageUrl;
      });
    }

    const nuevoArticulo = new CreateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, createArticuloDto)
    return nuevoArticulo;
  }

  findAll(id_usuario: string) {
    return this.articuloRepository.getAllArticulos(id_usuario);
  }

  findOne(id_usuario: string, id_articulo: string) {
    return this.articuloRepository.getArticuloById(id_usuario, id_articulo);
  }

  update(
    id_usuario: string, 
    id_articulo: string, 
    updateArticuloDto: UpdateArticuloDtoImpl,
    files?: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    }
  ) {
    // Procesar imagen principal del artículo si existe
    if (files?.image_file?.[0]) {
      const imageUrl = this.imageStorage.saveImage(files.image_file[0]);
      updateArticuloDto.image_url = imageUrl;
    }

    // Procesar imágenes de las secciones si existen
    // if (files?.sec_images && updateArticuloDto.sec_articulo) {
    //   files.sec_images.forEach((file, index) => {
    //     if (updateArticuloDto.sec_articulo[index]) {
    //       const imageUrl = this.imageStorage.saveImage(file);
    //       updateArticuloDto.sec_articulo[index].image_url = imageUrl;
    //     }
    //   });
    // }
    // Procesar imágenes de las secciones si existen
  if (files?.sec_images && updateArticuloDto.sec_articulo) {
    files.sec_images.forEach((file, index) => {
      if (!updateArticuloDto.sec_articulo[index]) return;

      // Ignorar placeholders/archivos vacíos
      if (typeof file.size === 'number') {
        if (file.size === 0) return;
      } else if (file.buffer) {
        if ((file.buffer as Buffer).length === 0) return;
      } else {
        return;
      }

      const imageUrl = this.imageStorage.saveImage(file);
      updateArticuloDto.sec_articulo[index].image_url = imageUrl;
    });
  }

    const editarArticulo = new UpdateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, id_articulo, updateArticuloDto);
    return editarArticulo;
  }

  delete(id_usuario: string, id_articulo: string) {
    const deleteArticulo = new DeleteArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, id_articulo)
    // return this.articuloRepository.deleteArticulo(id_usuario, id_articulo);
    return deleteArticulo;
  }
}
