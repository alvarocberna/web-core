
import {CreateSecArticuloDto, UpdateSecArticuloDto} from 'src/domain';

export abstract class CreateArticuloFullDto{
        articulo: CreateArticuloDto;
        sec_articulo: CreateSecArticuloDto[]
}

export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
        abstract autor_id: string;
        abstract sec_articulo: CreateSecArticuloDto[];
}

export abstract class UpdateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;  
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
        abstract autor_id: string;
        abstract sec_articulo: UpdateSecArticuloDto[]
}