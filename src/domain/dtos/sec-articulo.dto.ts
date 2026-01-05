
export abstract class CreateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string;
        abstract contenido_sec: string;
        abstract image: string;
}

export abstract class UpdateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string;
        abstract contenido_sec: string;
        abstract image: string;
}