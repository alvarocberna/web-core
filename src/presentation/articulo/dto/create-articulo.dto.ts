import { IsString, IsDate, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//domain
import { CreateArticuloFullDto, CreateArticuloDto, CreateSecArticuloDto } from "src/domain";

export class CreateArticuloFullDtoImpl implements CreateArticuloFullDto {
    articulo: CreateArticuloDto;
    sec_articulo: CreateSecArticuloDto[];
}

export class CreateSecArticuloDtoImpl implements CreateSecArticuloDto {
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    nro_seccion: number;

    @ApiProperty({ example: 'Título de la sección' })
    @IsString()
    titulo_sec: string;

    @ApiProperty({ example: 'Contenido de la sección...' })
    @IsString()
    contenido_sec: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString()
    image_url: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo de la imagen' })
    @IsOptional()
    @IsString()
    image_alt: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @IsString()
    image_position: string | null;
}

export class CreateArticuloDtoImpl implements CreateArticuloDto {
    @ApiProperty({ example: 'Título del artículo' })
    @IsString()
    titulo: string;

    @ApiProperty({ example: 'Subtítulo del artículo' })
    @IsString()
    subtitulo: string;

    @ApiProperty({ example: 'Juan García' })
    @IsString()
    autor: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    fecha_publicacion: Date;

    @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    fecha_actualizacion: Date | null;

    @ApiProperty({ example: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] })
    @IsString()
    status: string;

    @ApiProperty({ example: 'titulo-del-articulo' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString()
    image_url: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @IsString()
    image_alt: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @IsString()
    image_position: string | null;

    @ApiProperty({ example: 'uuid-del-autor' })
    @IsString()
    autor_id: string;

    @ApiProperty({ type: [CreateSecArticuloDtoImpl] })
    @ValidateNested()
    @Type(() => CreateSecArticuloDtoImpl)
    sec_articulo: CreateSecArticuloDtoImpl[];
}
