import { EquipoEntity, EmpleadoEntity, CreateEquipoDto, UpdateEquipoDto, CreateEmpleadoDto, UpdateEmpleadoDto } from 'src/domain';

export abstract class EquipoRepository {
    abstract createEquipo(id_usuario: string, createEquipoDto: CreateEquipoDto): Promise<EquipoEntity>;
    abstract getEquipo(id_usuario: string): Promise<EquipoEntity | null>;
    abstract updateEquipo(id_usuario: string, updateEquipoDto: UpdateEquipoDto): Promise<EquipoEntity>;

    abstract createEmpleado(id_usuario: string, createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity>;
    abstract getEmpleado(id_usuario: string, id_empleado: string): Promise<EmpleadoEntity>;
    abstract updateEmpleado(id_usuario: string, id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity>;
    abstract deleteEmpleado(id_usuario: string, id_empleado: string): Promise<void>;
}
