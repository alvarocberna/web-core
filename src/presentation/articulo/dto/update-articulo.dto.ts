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
    id!: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    nro_seccion?: number;

    @ApiPropertyOptional({ example: 'Título de la sección' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    titulo_sec?: string | null;

    @ApiPropertyOptional({ example: 'Contenido de la sección...' })
    @IsOptional()
    @SanitizeRich()
    @IsString()
    @MaxLength(5000)
    contenido_sec?: string | null;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    image_url?: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    image_alt?: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    image_position?: string | null;
}

export class UpdateArticuloDtoImpl implements UpdateArticuloDto {
    @ApiPropertyOptional({ example: 'Título actualizado' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    titulo?: string;

    @ApiPropertyOptional({ example: 'Subtítulo actualizado' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    subtitulo?: string | null;

    @ApiPropertyOptional({ example: 'Juan García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    autor?: string;

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fecha_publicacion?: Date;

    @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fecha_actualizacion?: Date | null;

    @ApiPropertyOptional({ example: 'PUBLISHED', enum: ArticuloStatus })
    @IsOptional()
    @IsEnum(ArticuloStatus)
    status?: ArticuloStatus;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;

    @ApiPropertyOptional({ example: 'titulo-actualizado' })
    @IsOptional()
    @Sanitize()
    @IsString()
    slug?: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    image_url?: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    image_alt?: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    image_position?: string | null;

    @ApiPropertyOptional({ type: [UpdateSecArticuloDtoImpl] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateSecArticuloDtoImpl)
    sec_articulo?: UpdateSecArticuloDtoImpl[];
}
