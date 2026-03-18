import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateEmpleadoDto } from 'src/domain';

export class UpdateEmpleadoDtoImpl implements UpdateEmpleadoDto {
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

    @ApiPropertyOptional({ example: '1' })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    orden: string | null;

    @ApiProperty({ example: 'activo' })
    @IsString()
    @MaxLength(50)
    activo: string;

    @ApiProperty({ example: 'https://example.com/foto.jpg' })
    @IsString()
    @MaxLength(500)
    img_url: string;

    @ApiProperty({ example: 'Foto de Juan Pérez' })
    @IsString()
    @MaxLength(200)
    img_alt: string;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug: string | null;
}
