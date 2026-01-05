import { IsString, IsDate, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
//domain
import { CreateArticuloFullDto, CreateArticuloDto, CreateSecArticuloDto } from "src/domain";

export class CreateArticuloFullDtoImpl implements CreateArticuloFullDto {
    articulo: CreateArticuloDto;
    sec_articulo: CreateSecArticuloDto[];
}

export class CreateArticuloDtoImpl implements CreateArticuloDto {
    @IsString()
    titulo: string;
    @IsString()
    subtitulo: string;
    @IsString()
    autor: string;
    @Type(() => Date)
    @IsDate()
    fecha_publicacion: Date;
    @Type(() => Date)
    @IsDate()
    fecha_actualizacion: Date | null;
    @IsString()
    status: string;
    @IsString()
    slug: string;
    @IsString()
    autor_id: string;
    @ValidateNested()
    @Type(() => CreateSecArticuloDtoImpl)
    sec_articulo: CreateSecArticuloDtoImpl[];
}

export class CreateSecArticuloDtoImpl implements CreateSecArticuloDto {
    @Type(() => Number)
    @IsNumber()
    nro_seccion: number;
    @IsString()
    titulo_sec: string;
    @IsString()
    contenido_sec: string;
    @IsString()
    image: string;
}