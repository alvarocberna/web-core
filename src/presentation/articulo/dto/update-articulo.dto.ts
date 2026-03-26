import { IsEnum, IsString, IsDate, IsBoolean, IsNumber, ValidateNested, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//domain
import { UpdateArticuloDto, UpdateSecArticuloDto } from "src/domain";
import { ArticuloStatus } from 'src/domain/enums/articulo-status.enum';
//sanitize
import { Sanitize, SanitizeRich, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class UpdateSecArticuloDtoImpl implements UpdateSecArticuloDto {
    @ApiProperty({ example: 'uuid-de-la-seccion' })
    @IsString()
    id: string;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    nro_seccion: number;

    @ApiProperty({ example: 'Título de la sección' })
    @Sanitize()
    @IsString()
    titulo_sec: string;

    @ApiProperty({ example: 'Contenido de la sección...' })
    @SanitizeRich()
    @IsString()
    @MaxLength(50000)
    contenido_sec: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    image_url: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(300)
    image_alt: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    image_position: string | null;
}

export class UpdateArticuloDtoImpl implements UpdateArticuloDto {
    @ApiProperty({ example: 'Título actualizado' })
    @Sanitize()
    @IsString()
    titulo: string;

    @ApiPropertyOptional({ example: 'Subtítulo actualizado' })
    @IsOptional()
    @Sanitize()
    @IsString()
    subtitulo: string | null;

    @ApiProperty({ example: 'Juan García' })
    @Sanitize()
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

    @ApiProperty({ example: 'PUBLISHED', enum: ArticuloStatus })
    @IsEnum(ArticuloStatus)
    status: ArticuloStatus;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;

    @ApiProperty({ example: 'titulo-actualizado' })
    @Sanitize()
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    image_url: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(300)
    image_alt: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    image_position: string | null;

    @ApiProperty({ type: [UpdateSecArticuloDtoImpl] })
    @ValidateNested()
    @Type(() => UpdateSecArticuloDtoImpl)
    sec_articulo: UpdateSecArticuloDtoImpl[];
}
