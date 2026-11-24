export abstract class CreateProyectoDto {
  abstract nombreProyecto: string;
  abstract descripcion: string;
  abstract cliente: string;
  abstract activo: boolean;
  abstract equipoHabilitado: boolean;
  abstract serviciosHabilitado: boolean;
  abstract articulosHabilitado: boolean;
  abstract testimoniosHabilitado: boolean;
  abstract nombre: string;
  abstract apellido: string;
  abstract email: string;
  abstract password: string;
  abstract rol: string;
}

export abstract class UpdateProyectoDto {
  abstract nombreProyecto: string;
  abstract descripcion: string;
  abstract cliente: string;
  abstract activo: boolean;
}
