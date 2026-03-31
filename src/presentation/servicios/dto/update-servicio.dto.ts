import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateServicioDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class UpdateServicioDtoImpl implements UpdateServicioDto {
    @ApiPropertyOptional({ example: 'Diseño Web' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_servicio?: string;

    @ApiPropertyOptional({ example: 'Creamos sitios web modernos y responsivos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

    @ApiPropertyOptional({ example: 10000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    valor?: number;

    @ApiPropertyOptional({ example: 'Promo verano' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    nombre_promocion?: string;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    porcentaje_descuento?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    destacado?: boolean;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    icono?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden?: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    activo?: boolean;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug: string;

    @ApiPropertyOptional({ example: 'https://example.com/servicio.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url?: string;

    @ApiPropertyOptional({ example: 'Imagen de diseño web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt?: string;
}
