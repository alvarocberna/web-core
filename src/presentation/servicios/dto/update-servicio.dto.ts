import { IsInt, IsBoolean, IsOptional, IsString, IsNumber, MinLength, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateServicioDto, UpdateSecServicioDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl, SanitizeRich } from 'src/common/decorators/sanitize.decorator';

export class UpdateSecServicioDtoImpl implements UpdateSecServicioDto {
    @ApiProperty({ example: 'uuid-de-la-seccion' })
    @IsString()
    id!: string;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    nro_seccion!: number;

    @ApiProperty({ example: 'Título de la sección' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo_sec!: string | null;

    @ApiProperty({ example: 'Contenido de la sección...' })
    @SanitizeRich()
    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    contenido_sec!: string | null;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    image_url!: string | null;

    @ApiPropertyOptional({ example: 'Texto alternativo de la imagen' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    image_alt!: string | null;

    @ApiPropertyOptional({ example: 'center' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    image_position!: string | null;
}

export class UpdateServicioDtoImpl implements UpdateServicioDto {
    @ApiPropertyOptional({ example: 'Diseño Web' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_servicio!: string;

    @ApiPropertyOptional({ example: 'Creamos sitios web modernos y responsivos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion!: string;

    @ApiPropertyOptional({ example: 10000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    valor!: number;

    @ApiPropertyOptional({ example: 'Promo verano' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    nombre_promocion!: string;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    porcentaje_descuento!: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    destacado!: boolean;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    icono!: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden!: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug!: string | null;

    @ApiPropertyOptional({ example: 'https://example.com/servicio.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url!: string;

    @ApiPropertyOptional({ example: 'Imagen de diseño web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt!: string;

    @ApiProperty({ type: [UpdateSecServicioDtoImpl] })
    @ValidateNested()
    @Type(() => UpdateSecServicioDtoImpl)
    sec_servicio!: UpdateSecServicioDtoImpl[];
}
