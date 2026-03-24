import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmpleadoDto } from 'src/domain';

export class CreateEmpleadoDtoImpl implements CreateEmpleadoDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre_primero: string;

    @ApiPropertyOptional({ example: 'Carlos' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombre_segundo: string | null;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido_paterno: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    apellido_materno: string | null;

    @ApiProperty({ example: 'Desarrollador' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    profesion: string;

    @ApiPropertyOptional({ example: 'Frontend' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    especialidad: string | null;

    @ApiPropertyOptional({ example: 'Especialista en interfaces de usuario' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion: string | null;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden: number | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    img_url: string;

    @ApiPropertyOptional({ example: 'Foto de Juan Pérez' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    img_alt: string;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug: string | null;
}
