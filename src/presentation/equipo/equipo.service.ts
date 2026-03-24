import { Injectable } from '@nestjs/common';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
import { EquipoRepositoryService, ImageStorageRepositoryService } from 'src/infrastructure';

@Injectable()
export class EquipoService {
    constructor(
        private readonly equipoRepository: EquipoRepositoryService,
        private readonly imageStorage: ImageStorageRepositoryService,
    ) {}

    // ─── Equipo (Entidad padre) ──────────────────────────────────────────────────

    create(id_usuario: string, createEquipoDto: CreateEquipoDtoImpl) {
        return this.equipoRepository.createEquipo(id_usuario, createEquipoDto);
    }

    find(id_usuario: string) {
        return this.equipoRepository.getEquipo(id_usuario);
    }

    update(id_usuario: string, updateEquipoDto: UpdateEquipoDtoImpl) {
        return this.equipoRepository.updateEquipo(id_usuario, updateEquipoDto);
    }

    // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

    async createEmpleado(
        id_usuario: string,
        createEmpleadoDto: CreateEmpleadoDtoImpl,
        files?: { image_file?: Express.Multer.File[] },
    ) {
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            createEmpleadoDto.img_url = imageUrl;
        }
        return this.equipoRepository.createEmpleado(id_usuario, createEmpleadoDto);
    }

    findEmpleado(id_usuario: string, id_empleado: string) {
        return this.equipoRepository.getEmpleado(id_usuario, id_empleado);
    }

    async updateEmpleado(
        id_usuario: string,
        id_empleado: string,
        updateEmpleadoDto: UpdateEmpleadoDtoImpl,
        files?: { image_file?: Express.Multer.File[] },
    ) {
        if (files?.image_file?.[0]) {
            const imageUrl = await this.imageStorage.saveImage(files.image_file[0]);
            updateEmpleadoDto.img_url = imageUrl;
        }
        return this.equipoRepository.updateEmpleado(id_usuario, id_empleado, updateEmpleadoDto);
    }

    removeEmpleado(id_usuario: string, id_empleado: string) {
        return this.equipoRepository.deleteEmpleado(id_usuario, id_empleado);
    }
}
