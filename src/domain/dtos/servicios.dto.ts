
//SERVICIOS - ENTIDAD PADRE
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

//SERVICIO - ENTIDAD HIJA
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
    abstract slug: string | null;
    abstract img_url: string | null;
    abstract img_alt: string | null;
    abstract sec_servicio: CreateSecServicioDto[] | null; 
}

export abstract class UpdateServicioDto {
    abstract nombre_servicio: string;
    abstract descripcion: string | null;
    abstract valor: number | null;
    abstract nombre_promocion: string | null;
    abstract porcentaje_descuento: number | null;
    abstract destacado: boolean;
    abstract icono: string | null;
    abstract orden: number | null;
    abstract activo: boolean;
    abstract slug: string | null;
    abstract img_url: string | null;
    abstract img_alt: string | null;
    abstract sec_servicio: CreateSecServicioDto[] | null; 
}

//SEC-SERVICIO - ENTIDAD NIETA JAJ
export abstract class CreateSecServicioDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}

export abstract class UpdateSecServicioDto{
        abstract id: string;
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}