import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmpleadoDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class CreateEmpleadoDtoImpl implements CreateEmpleadoDto {
    @ApiProperty({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    nombre_primero: string;

    @ApiPropertyOptional({ example: 'Carlos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    nombre_segundo: string | null;

    @ApiProperty({ example: 'Pérez' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    apellido_paterno: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    apellido_materno: string | null;

    @ApiProperty({ example: 'Desarrollador' })
    @Sanitize()
    @IsString()
    @MaxLength(200)
    profesion: string | null;

    @ApiPropertyOptional({ example: 'Frontend' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    especialidad: string | null;

    @ApiPropertyOptional({ example: 'Especialista en interfaces de usuario' })
    @IsOptional()
    @Sanitize()
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

    @ApiPropertyOptional({ example: 'juan-perez' })
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug: string;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url: string | null;

    @ApiPropertyOptional({ example: 'Foto de Juan Pérez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt: string | null;

}
