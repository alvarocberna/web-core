import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateServicioDto } from 'src/domain';

export class UpdateServicioDtoImpl implements UpdateServicioDto {
    @ApiProperty({ example: 'Diseño Web' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_servicio: string;

    @ApiPropertyOptional({ example: 'Creamos sitios web modernos y responsivos' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion: string | null;

    @ApiPropertyOptional({ example: '1500' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    valor: string | null;

    @ApiPropertyOptional({ example: 'Promo verano' })
    @IsOptional()
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
    destacado: boolean | null;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
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
    @IsString()
    @MaxLength(500)
    img_url: string | null;

    @ApiPropertyOptional({ example: 'Imagen de diseño web' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    img_alt: string | null;
}
