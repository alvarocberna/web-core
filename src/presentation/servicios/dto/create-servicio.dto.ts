import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateServicioDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class CreateServicioDtoImpl implements CreateServicioDto {
    @ApiProperty({ example: 'Diseño Web' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_servicio: string;

    @ApiPropertyOptional({ example: 'Creamos sitios web modernos y responsivos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion: string | null;

    @ApiPropertyOptional({ example: '1500' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    valor: string | null;

    @ApiPropertyOptional({ example: 'Promo verano' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    nombre_promocion: string | null;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    porcentaje_descuento: number | null;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    destacado: boolean;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    icono: string | null;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden: number | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;

    @ApiPropertyOptional({ example: 'https://example.com/servicio.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url: string | null;

    @ApiPropertyOptional({ example: 'Imagen de diseño web' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt: string | null;
}
