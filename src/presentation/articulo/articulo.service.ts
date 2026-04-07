import { Injectable } from '@nestjs/common';
import { CreateArticulosDtoImpl } from './dto/create-articulos.dto';
import { UpdateArticulosDtoImpl } from './dto/update-articulos.dto';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
//domain
import { CreateArticuloUseCase, UpdateArticuloUseCase, DeleteArticuloUseCase } from 'src/domain';
//infrastructure
import { ArticuloRepositoryService, ActividadRepositoryService, ImageStorageRepositoryService } from 'src/infrastructure';

@Injectable()
export class ArticuloService {

    constructor(
        private readonly articuloRepository: ArticuloRepositoryService,
        private readonly actividadRepository: ActividadRepositoryService,
        private readonly imageStorage: ImageStorageRepositoryService,
    ) {}

    // ─── Articulos (entidad padre) ────────────────────────────────────────────

    createArticulos(id_usuario: string, createArticulosDto: CreateArticulosDtoImpl) {
        return this.articuloRepository.createArticulos(id_usuario, createArticulosDto);
    }

    findArticulos(id_usuario: string) {
        return this.articuloRepository.getArticulos(id_usuario);
    }

    updateArticulos(id_usuario: string, updateArticulosDto: UpdateArticulosDtoImpl) {
        return this.articuloRepository.updateArticulos(id_usuario, updateArticulosDto);
    }

    // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

    async createArticulo(
        id_usuario: string,
        createArticuloDto: CreateArticuloDtoImpl,
        files?: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        // Procesar imagen principal del artículo si existe
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            createArticuloDto.image_url = imageUrl;
        }

        // Procesar imágenes de las secciones si existen
        if (files?.sec_images && createArticuloDto.sec_articulo) {
            for (const [index, file] of files.sec_images.entries()) {
                if (!createArticuloDto.sec_articulo[index]) continue;

                if (typeof file.size === 'number') {
                    if (file.size === 0) continue;
                } else if (file.buffer) {
                    if ((file.buffer as Buffer).length === 0) continue;
                } else {
                    continue;
                }

                const imageUrl = await this.imageStorage.saveImage(file);
                createArticuloDto.sec_articulo[index].image_url = imageUrl;
            }
        }

        return new CreateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, createArticuloDto);
    }

    findArticuloById(id_usuario: string, id_articulo: string) {
        return this.articuloRepository.getArticuloById(id_usuario, id_articulo);
    }

    async updateArticulo(
        id_usuario: string,
        id_articulo: string,
        updateArticuloDto: UpdateArticuloDtoImpl,
        files?: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        // Procesar imagen principal del artículo si existe
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            updateArticuloDto.image_url = imageUrl;
        }

        // Procesar imágenes de las secciones si existen
        if (files?.sec_images && updateArticuloDto.sec_articulo) {
            for (const [index, file] of files.sec_images.entries()) {
                if (!updateArticuloDto.sec_articulo[index]) continue;

                if (typeof file.size === 'number') {
                    if (file.size === 0) continue;
                } else if (file.buffer) {
                    if ((file.buffer as Buffer).length === 0) continue;
                } else {
                    continue;
                }

                const imageUrl = await this.imageStorage.saveImage(file);
                updateArticuloDto.sec_articulo[index].image_url = imageUrl;
            }
        }

        return new UpdateArticuloUseCase(this.articuloRepository, this.actividadRepository).execute(id_usuario, id_articulo, updateArticuloDto);
    }

    updateArticuloStatus(id_usuario: string, id_articulo: string, data: { status: string }) {
        return this.articuloRepository.updateArticuloStatus(id_usuario, id_articulo, data)
    }

    deleteArticulo(id_usuario: string, id_articulo: string) {
        return new DeleteArticuloUseCase(this.articuloRepository, this.actividadRepository, this.imageStorage).execute(id_usuario, id_articulo);
    }
}
