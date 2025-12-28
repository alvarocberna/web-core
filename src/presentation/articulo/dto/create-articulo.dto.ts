import { IsString, IsDate, IsNumber } from 'class-validator';
//domain
import { CreateArticuloFullDto, CreateArticuloDto, CreateSecArticuloDto } from "src/domain";

export class CreateArticuloFullDtoImpl implements CreateArticuloFullDto {
    articulo: CreateArticuloDto;
    secArticulo: CreateSecArticuloDto[];
}

export class CreateArticuloDtoImpl implements CreateArticuloDto {
    @IsString()
    titulo: string;
    @IsString()
    subtitulo: string;
    @IsString()
    autor: string;
    @IsDate()
    fecha_publicacion: Date;
    @IsDate()
    fecha_actualizacion: Date | null;
    @IsString()
    status: string;
    @IsString()
    slug: string;
    @IsString()
    autor_id: string;
}

export class CreateSecArticuloDtoImpl implements CreateSecArticuloDto {
    @IsNumber()
    nro_seccion: number;
    @IsString()
    titulo: string;
    @IsString()
    subtitulo: string;
    @IsString()
    contenido: string;
    @IsString()
    image: string;
}