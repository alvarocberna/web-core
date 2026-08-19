import {
  EquipoEntity,
  EmpleadoEntity,
  CreateEquipoDto,
  UpdateEquipoDto,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
  UpdateEmpleadoOrdenDto,
} from 'src/domain';

export abstract class EquipoRepository {
  abstract createEquipo(
    usuarioId: string,
    createEquipoDto: CreateEquipoDto,
  ): Promise<EquipoEntity>;
  abstract getEquipo(usuarioId: string): Promise<EquipoEntity | null>;
  abstract updateEquipo(
    usuarioId: string,
    updateEquipoDto: UpdateEquipoDto,
  ): Promise<EquipoEntity>;

  abstract createEmpleado(
    usuarioId: string,
    createEmpleadoDto: CreateEmpleadoDto,
  ): Promise<EmpleadoEntity>;
  abstract getEmpleado(
    usuarioId: string,
    empleadoId: string,
  ): Promise<EmpleadoEntity>;
  abstract updateEmpleado(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<EmpleadoEntity>;
  abstract updateEmpleadoOrden(
    usuarioId: string,
    empleadoId: string,
    updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDto,
  ): Promise<EmpleadoEntity>;
  abstract deleteEmpleado(usuarioId: string, empleadoId: string): Promise<void>;

  // public
  abstract getEquipoPublic(proyectoId: string): Promise<EquipoEntity | null>;
}
