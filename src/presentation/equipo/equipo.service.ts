import { Injectable } from '@nestjs/common';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
import { EquipoRepositoryService } from 'src/infrastructure';

@Injectable()
export class EquipoService {
    constructor(private readonly equipoRepository: EquipoRepositoryService) {}

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

    createEmpleado(id_usuario: string, createEmpleadoDto: CreateEmpleadoDtoImpl) {
        return this.equipoRepository.createEmpleado(id_usuario, createEmpleadoDto);
    }

    findEmpleado(id_usuario: string, id_empleado: string) {
        return this.equipoRepository.getEmpleado(id_usuario, id_empleado);
    }

    updateEmpleado(id_usuario: string, id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDtoImpl) {
        return this.equipoRepository.updateEmpleado(id_usuario, id_empleado, updateEmpleadoDto);
    }

    removeEmpleado(id_usuario: string, id_empleado: string) {
        return this.equipoRepository.deleteEmpleado(id_usuario, id_empleado);
    }
}
