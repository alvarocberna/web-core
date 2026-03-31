import { IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateServiciosDto } from 'src/domain';

export class UpdateServiciosDtoImpl implements UpdateServiciosDto {
    @ApiPropertyOptional({ example: 'Nuestros Servicios' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo?: string;

    @ApiPropertyOptional({ example: 'Descubre todo lo que ofrecemos' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

    @ApiPropertyOptional({ example: 'icon-services' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    icono?: string;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    activo?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    notificacion?: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    habilitado?: boolean;
}
