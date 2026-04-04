
// EQUIPO - ENTIDAD PADRE
export abstract class CreateEquipoDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
    abstract notificacion: boolean;
    abstract habilitado: boolean;
}

export abstract class UpdateEquipoDto {
    abstract titulo?: string;
    abstract descripcion?: string;
    abstract activo?: boolean;
    abstract notificacion?: boolean;
    abstract habilitado?: boolean;
}

//EMPLEADO - ENTIDAD HIJA
export abstract class CreateEmpleadoDto {
    abstract nombre_primero: string;
    abstract nombre_segundo: string | null;
    abstract apellido_paterno: string;
    abstract apellido_materno: string | null;
    abstract profesion: string | null;
    abstract especialidad: string | null;
    abstract descripcion: string | null;
    abstract orden: number | null;
    abstract activo: boolean;
    abstract slug: string;
    abstract img_url: string | null;
    abstract img_alt: string | null;
    abstract sec_empleado: CreateSecEmpleadoDto[] | null; 
}

export abstract class UpdateEmpleadoDto {
    abstract id: string;
    abstract nombre_primero: string;
    abstract nombre_segundo: string | null;
    abstract apellido_paterno: string;
    abstract apellido_materno: string | null;
    abstract profesion: string | null;
    abstract especialidad: string | null;
    abstract descripcion: string | null;
    abstract orden: number | null;
    abstract activo: boolean;
    abstract slug: string;
    abstract img_url: string | null;
    abstract img_alt: string | null;
    abstract sec_empleado: UpdateSecEmpleadoDto[] | null; 
}

//SEC-EMPLEADO - ENTIDAD NIETA JAJ
export abstract class CreateSecEmpleadoDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}

export abstract class UpdateSecEmpleadoDto{
        abstract id: string;
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}