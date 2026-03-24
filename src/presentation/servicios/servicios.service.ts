import { Injectable } from '@nestjs/common';
import { CreateServiciosDtoImpl } from './dto/create-servicios.dto';
import { UpdateServiciosDtoImpl } from './dto/update-servicios.dto';
import { CreateServicioDtoImpl } from './dto/create-servicio.dto';
import { UpdateServicioDtoImpl } from './dto/update-servicio.dto';
import { ServiciosRepositoryService, ImageStorageRepositoryService } from 'src/infrastructure';

@Injectable()
export class ServiciosService {
    constructor(
        private readonly serviciosRepository: ServiciosRepositoryService,
        private readonly imageStorage: ImageStorageRepositoryService,
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
        files?: { image_file?: Express.Multer.File[] },
    ) {
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            createServicioDto.img_url = imageUrl;
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
        files?: { image_file?: Express.Multer.File[] },
    ) {
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            updateServicioDto.img_url = imageUrl;
        }
        return this.serviciosRepository.updateServicio(id_usuario, id_servicio, updateServicioDto);
    }

    removeServicio(id_usuario: string, id_servicio: string) {
        return this.serviciosRepository.deleteServicio(id_usuario, id_servicio);
    }
}
