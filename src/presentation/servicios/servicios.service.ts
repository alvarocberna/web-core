import { Injectable } from '@nestjs/common';
import { CreateServiciosDtoImpl } from './dto/create-servicios.dto';
import { UpdateServiciosDtoImpl } from './dto/update-servicios.dto';
import { CreateServicioDtoImpl } from './dto/create-servicio.dto';
import { UpdateServicioDtoImpl } from './dto/update-servicio.dto';
import { UpdateServicioOrdenDtoImpl } from './dto/update-servicio-orden.dto';
import { ServiciosRepositoryService, ImageStorageRepositoryService } from 'src/infrastructure';
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

    create(id_usuario: string, createServiciosDto: CreateServiciosDtoImpl) {
        return this.serviciosRepository.createServicios(id_usuario, createServiciosDto);
    }

    find(id_usuario: string) {
        return this.serviciosRepository.getServicios(id_usuario);
    }

    update(id_usuario: string, updateServiciosDto: UpdateServiciosDtoImpl) {
        return this.serviciosRepository.updateServicios(id_usuario, updateServiciosDto);
    }

    // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

    async createServicio(
        id_usuario: string,
        createServicioDto: CreateServicioDtoImpl,
        files?: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            createServicioDto.img_url = imageUrl;
        }

        if (files?.sec_images && createServicioDto.sec_servicio) {
            for (const [index, file] of files.sec_images.entries()) {
                if (!createServicioDto.sec_servicio[index]) continue;

                if (typeof file.size === 'number') {
                    if (file.size === 0) continue;
                } else if (file.buffer) {
                    if ((file.buffer as Buffer).length === 0) continue;
                } else {
                    continue;
                }

                const imageUrl = await this.imageStorage.saveImage(file);
                createServicioDto.sec_servicio[index].image_url = imageUrl;
            }
        }

        return this.serviciosRepository.createServicio(id_usuario, createServicioDto);
    }

    findServicio(id_usuario: string, id_servicio: string) {
        return this.serviciosRepository.getServicio(id_usuario, id_servicio);
    }

    async updateServicio(
        id_usuario: string,
        id_servicio: string,
        updateServicioDto: UpdateServicioDtoImpl,
        files?: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const currentServicio = await this.serviciosRepository.getServicio(id_usuario, id_servicio) as any;

        if (files?.image_file?.[0]) {
            if (currentServicio?.img_url) {
                await this.imageStorage.deleteImageByUrl(currentServicio.img_url);
            }
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            updateServicioDto.img_url = imageUrl;
        }

        // Eliminar imágenes de secciones que ya no están en la nueva data
        if (currentServicio?.sec_servicio?.length) {
            const nuevosIds = new Set((updateServicioDto.sec_servicio ?? []).map((s) => s.id));
            const seccionesEliminadas = currentServicio.sec_servicio.filter((s: any) => !nuevosIds.has(s.id));
            await Promise.all(
                seccionesEliminadas
                    .filter((s: any) => s.image_url)
                    .map((s: any) => this.imageStorage.deleteImageByUrl(s.image_url)),
            );
        }

        if (files?.sec_images && updateServicioDto.sec_servicio) {
            for (const [index, file] of files.sec_images.entries()) {
                if (!updateServicioDto.sec_servicio[index]) continue;

                if (typeof file.size === 'number') {
                    if (file.size === 0) continue;
                } else if (file.buffer) {
                    if ((file.buffer as Buffer).length === 0) continue;
                } else {
                    continue;
                }

                const seccionId = updateServicioDto.sec_servicio[index].id;
                const oldSeccion = currentServicio?.sec_servicio?.find((s: any) => s.id === seccionId);
                if (oldSeccion?.image_url) {
                    await this.imageStorage.deleteImageByUrl(oldSeccion.image_url);
                }

                const imageUrl = await this.imageStorage.saveImage(file);
                updateServicioDto.sec_servicio[index].image_url = imageUrl;
            }
        }

        return this.serviciosRepository.updateServicio(id_usuario, id_servicio, updateServicioDto);
    }

    updateServicioOrden(id_usuario: string, id_servicio: string, updateServicioOrdenDto: UpdateServicioOrdenDtoImpl) {
        return this.serviciosRepository.updateServicioOrden(id_usuario, id_servicio, updateServicioOrdenDto);
    }

    removeServicio(id_usuario: string, id_servicio: string) {
        return new DeleteServicioUseCase(this.serviciosRepository, this.imageStorage, this.usuarioRepository).execute(id_usuario, id_servicio)
        return this.serviciosRepository.deleteServicio(id_usuario, id_servicio);
    }
}
