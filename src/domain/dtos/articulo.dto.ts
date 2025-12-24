
export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract status: string;
        abstract slug: string;
        abstract autor_id: string;
}

export abstract class UpdateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract status: string;
        abstract slug: string;  
        abstract autor_id: string;
}