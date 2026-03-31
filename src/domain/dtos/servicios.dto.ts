export abstract class CreateServiciosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract icono: string | null;
    abstract activo: boolean;
    abstract notificacion: boolean;
    abstract habilitado: boolean;
}

export abstract class UpdateServiciosDto {
    abstract titulo?: string;
    abstract descripcion?: string;
    abstract icono?: string;
    abstract activo?: boolean;
    abstract notificacion?: boolean;
    abstract habilitado?: boolean;
}

export abstract class CreateServicioDto {
    abstract nombre_servicio: string;
    abstract descripcion: string | null;
    abstract valor: number | null;
    abstract nombre_promocion: string | null;
    abstract porcentaje_descuento: number | null;
    abstract destacado: boolean;
    abstract icono: string | null;
    abstract orden: number | null;
    abstract activo: boolean;
    abstract slug: string;
    abstract img_url: string | null;
    abstract img_alt: string | null;
}

export abstract class UpdateServicioDto {
    abstract nombre_servicio?: string;
    abstract descripcion?: string;
    abstract valor?: number;
    abstract nombre_promocion?: string;
    abstract porcentaje_descuento?: number;
    abstract destacado?: boolean;
    abstract icono?: string;
    abstract orden?: number;
    abstract activo?: boolean;
    abstract slug?: string;
    abstract img_url?: string;
    abstract img_alt?: string;
}
