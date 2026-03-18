import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateServicioDto } from 'src/domain';

export class CreateServicioDtoImpl implements CreateServicioDto {
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

    @ApiPropertyOptional({ example: '20' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    porcentaje_descuento: string | null;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    destacado: boolean | null;

    @ApiPropertyOptional({ example: 'icon-web' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    icono: string | null;

    @ApiPropertyOptional({ example: '1' })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    orden: string | null;

    @ApiProperty({ example: 'activo' })
    @IsString()
    @MaxLength(50)
    activo: string;

    @ApiProperty({ example: 'https://example.com/servicio.jpg' })
    @IsString()
    @MaxLength(500)
    img_url: string;

    @ApiProperty({ example: 'Imagen de diseño web' })
    @IsString()
    @MaxLength(200)
    img_alt: string;
}
