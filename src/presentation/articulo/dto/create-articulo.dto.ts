import {
  IsEnum,
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
//domain
import { CreateArticuloDto, CreateSecArticuloDto } from 'src/domain';
import { ArticuloStatus } from 'src/domain/enums/articulo-status.enum';
//sanitize
import {
  Sanitize,
  SanitizeRich,
  SanitizeUrl,
} from 'src/common/decorators/sanitize.decorator';

// export class CreateArticuloFullDtoImpl implements CreateArticuloFullDto {
//     articulo: CreateArticuloDto;
//     secArticulo: CreateSecArticuloDto[];
// }

export class CreateSecArticuloDtoImpl implements CreateSecArticuloDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  nroSeccion!: number;

  @ApiProperty({ example: 'Título de la sección' })
  @Sanitize()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tituloSec!: string | null;

  @ApiProperty({ example: 'Contenido de la sección...' })
  @SanitizeRich()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  contenidoSec!: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @SanitizeUrl()
  @IsString()
  @MaxLength(500)
  imageUrl!: string | null;

  @ApiPropertyOptional({ example: 'Texto alternativo de la imagen' })
  @IsOptional()
  @Sanitize()
  @IsString()
  @MaxLength(100)
  imageAlt!: string | null;

  @ApiPropertyOptional({ example: 'center' })
  @IsOptional()
  @Sanitize()
  @IsString()
  @MaxLength(50)
  imagePosition!: string | null;
}

export class CreateArticuloDtoImpl implements CreateArticuloDto {
  @ApiProperty({ example: 'Título del artículo' })
  @Sanitize()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  titulo!: string;

  @ApiPropertyOptional({ example: 'Subtítulo del artículo' })
  @IsOptional()
  @Sanitize()
  @IsString()
  @MaxLength(500)
  subtitulo!: string | null;

  @ApiProperty({ example: 'Juan García' })
  @Sanitize()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  autor!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  fechaPublicacion!: Date;

  @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  fechaActualizacion!: Date | null;

  @ApiProperty({ example: 'PUBLISHED', enum: ArticuloStatus })
  @IsEnum(ArticuloStatus)
  status!: ArticuloStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  activo!: boolean;

  @ApiProperty({ example: 'titulo-del-articulo' })
  @Sanitize()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  slug!: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @SanitizeUrl()
  @IsString()
  @MaxLength(500)
  imageUrl!: string | null;

  @ApiPropertyOptional({ example: 'Texto alternativo' })
  @IsOptional()
  @Sanitize()
  @IsString()
  @MaxLength(100)
  imageAlt!: string | null;

  @ApiPropertyOptional({ example: 'center' })
  @IsOptional()
  @Sanitize()
  @IsString()
  @MaxLength(50)
  imagePosition!: string | null;

  @ApiProperty({ type: [CreateSecArticuloDtoImpl] })
  @ValidateNested()
  @Type(() => CreateSecArticuloDtoImpl)
  secArticulo!: CreateSecArticuloDtoImpl[];
}
