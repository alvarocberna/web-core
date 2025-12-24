
export abstract class CreateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo: string;
        abstract subtitulo: string;
        abstract contenido: string;
        abstract image: number;
}

export abstract class UpdateSecArticuloDto{
        abstract nro_seccion: number;
        abstract titulo: string;
        abstract subtitulo: string;
        abstract contenido: string;
        abstract image: number;
}