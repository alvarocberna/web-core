
export abstract class CreateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string;
        abstract contenido_sec: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}

export abstract class UpdateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string;
        abstract contenido_sec: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}