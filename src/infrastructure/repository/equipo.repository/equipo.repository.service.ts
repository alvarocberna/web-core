import { Injectable } from '@nestjs/common';
import {
    EquipoRepository,
    EquipoEntity,
    EmpleadoEntity,
    CreateEquipoDto,
    UpdateEquipoDto,
    CreateEmpleadoDto,
    UpdateEmpleadoDto,
} from 'src/domain';
import { EquipoDatasourceService } from 'src/infrastructure';

@Injectable()
export class EquipoRepositoryService implements EquipoRepository {
    constructor(private readonly equipoDatasource: EquipoDatasourceService) {}

    createEquipo(id_usuario: string, createEquipoDto: CreateEquipoDto): Promise<EquipoEntity> {
        return this.equipoDatasource.createEquipo(id_usuario, createEquipoDto);
    }

    getEquipo(id_usuario: string): Promise<EquipoEntity | null> {
        return this.equipoDatasource.getEquipo(id_usuario);
    }

    updateEquipo(id_usuario: string, updateEquipoDto: UpdateEquipoDto): Promise<EquipoEntity> {
        return this.equipoDatasource.updateEquipo(id_usuario, updateEquipoDto);
    }

    createEmpleado(id_usuario: string, createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        return this.equipoDatasource.createEmpleado(id_usuario, createEmpleadoDto);
    }

    getEmpleado(id_usuario: string, id_empleado: string): Promise<EmpleadoEntity> {
        return this.equipoDatasource.getEmpleado(id_usuario, id_empleado);
    }

    updateEmpleado(id_usuario: string, id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
        return this.equipoDatasource.updateEmpleado(id_usuario, id_empleado, updateEmpleadoDto);
    }

    deleteEmpleado(id_usuario: string, id_empleado: string): Promise<void> {
        return this.equipoDatasource.deleteEmpleado(id_usuario, id_empleado);
    }
}
