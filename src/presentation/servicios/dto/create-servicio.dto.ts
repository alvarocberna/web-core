import { IsInt, IsBoolean, IsOptional, IsString, IsNumber, MinLength, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateServicioDto, CreateSecServicioDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl, SanitizeRich } from 'src/common/decorators/sanitize.decorator';

export class CreateSecServicioDtoImpl implements CreateSecServicioDto {
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

export class CreateServicioDtoImpl implements CreateServicioDto {
    @ApiProperty({ example: 'Diseño Web' })
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
    descripcion!: string | null;

    @ApiPropertyOptional({ example: 10000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    valor!: number | null;

    @ApiPropertyOptional({ example: 'Promo verano' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    nombre_promocion!: string | null;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    porcentaje_descuento!: number | null;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    destacado!: boolean;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    icono!: string | null;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden!: number | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug!: string;

    @ApiPropertyOptional({ example: 'https://example.com/servicio.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url!: string | null;

    @ApiPropertyOptional({ example: 'Imagen de diseño web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt!: string | null;

    @ApiProperty({ type: [CreateSecServicioDtoImpl] })
    @ValidateNested()
    @Type(() => CreateSecServicioDtoImpl)
    sec_servicio!: CreateSecServicioDtoImpl[];
}
