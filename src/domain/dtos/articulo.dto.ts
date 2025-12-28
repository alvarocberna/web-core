
import {CreateSecArticuloDto} from 'src/domain';

export abstract class CreateArticuloFullDto{
        articulo: CreateArticuloDto;
        secArticulo: CreateSecArticuloDto[]
}

export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;
        abstract autor_id: string;
}

export abstract class UpdateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;  
        abstract autor_id: string;
}