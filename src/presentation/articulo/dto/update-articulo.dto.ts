import { IsString, IsDate } from 'class-validator';
//domain
import { UpdateArticuloDto } from "src/domain";

export class UpdateArticuloDtoImpl implements UpdateArticuloDto {
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