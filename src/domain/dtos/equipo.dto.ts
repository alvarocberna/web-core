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
}

export abstract class UpdateEmpleadoDto {
    abstract nombre_primero?: string;
    abstract nombre_segundo?: string;
    abstract apellido_paterno?: string;
    abstract apellido_materno?: string;
    abstract profesion?: string;
    abstract especialidad?: string;
    abstract descripcion?: string;
    abstract orden?: number;
    abstract activo?: boolean;
    abstract slug?: string;
    abstract img_url?: string;
    abstract img_alt?: string;
}
