import { IsString, IsDate, IsBoolean, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//domain
import { UpdateArticuloDto, UpdateSecArticuloDto } from "src/domain";

export class UpdateSecArticuloDtoImpl implements UpdateSecArticuloDto {
    @ApiProperty({ example: 'uuid-de-la-seccion' })
    @IsString()
    id: string;

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

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @IsString()
    image_alt: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @IsString()
    image_position: string | null;
}

export class UpdateArticuloDtoImpl implements UpdateArticuloDto {
    @ApiProperty({ example: 'Título actualizado' })
    @IsString()
    titulo: string;

    @ApiPropertyOptional({ example: 'Subtítulo actualizado' })
    @IsOptional()
    @IsString()
    subtitulo: string | null;

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

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;

    @ApiProperty({ example: 'titulo-actualizado' })
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

    @ApiProperty({ type: [UpdateSecArticuloDtoImpl] })
    @ValidateNested()
    @Type(() => UpdateSecArticuloDtoImpl)
    sec_articulo: UpdateSecArticuloDtoImpl[];
}
