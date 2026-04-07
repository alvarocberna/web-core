
//ARTICULOS - ENTIDAD PADRE
export abstract class CreateArticulosDto {
        abstract titulo: string;
        abstract descripcion: string | null;
        abstract activo: boolean;
        abstract aprobar: boolean;
        abstract notificacion: boolean;
        abstract habilitado: boolean;
}

export abstract class UpdateArticulosDto {
        abstract titulo?: string;
        abstract descripcion?: string;
        abstract activo?: boolean;
        abstract aprobar?: boolean;
        abstract notificacion?: boolean;
        abstract habilitado?: boolean;
}

// export abstract class CreateArticuloFullDto{
//         articulo: CreateArticuloDto;
//         sec_articulo: CreateSecArticuloDto[]
// }

//ARTICULO - ENTIDAD HIJA

export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string | null;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
        abstract sec_articulo: CreateSecArticuloDto[];
}

export abstract class UpdateArticuloDto{
        abstract titulo?: string;
        abstract subtitulo?: string | null;
        abstract autor?: string;
        abstract fecha_publicacion?: Date;
        abstract fecha_actualizacion?: Date | null;
        abstract status?: string;
        abstract activo?: boolean;
        abstract slug?: string;
        abstract image_url?: string | null;
        abstract image_alt?: string | null;
        abstract image_position?: string | null;
        abstract sec_articulo?: UpdateSecArticuloDto[]
}

//SEC-ARTICULO - ENTIDAD NIETA JAJ
export abstract class CreateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}

export abstract class UpdateSecArticuloDto{
        abstract id: string;
        abstract nro_seccion?: number;
        abstract titulo_sec?: string | null;
        abstract contenido_sec?: string | null;
        abstract image_url?: string | null;
        abstract image_alt?: string | null;
        abstract image_position?: string | null;
}