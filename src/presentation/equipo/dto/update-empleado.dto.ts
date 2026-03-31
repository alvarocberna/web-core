import { IsInt, IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateEmpleadoDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class UpdateEmpleadoDtoImpl implements UpdateEmpleadoDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    nombre_primero?: string;

    @ApiPropertyOptional({ example: 'Carlos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    nombre_segundo?: string;

    @ApiPropertyOptional({ example: 'Pérez' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    apellido_paterno?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    apellido_materno?: string;

    @ApiPropertyOptional({ example: 'Desarrollador' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    profesion?: string;

    @ApiPropertyOptional({ example: 'Frontend' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    especialidad?: string;

    @ApiPropertyOptional({ example: 'Especialista en interfaces de usuario' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

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
    slug?: string;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url?: string;

    @ApiPropertyOptional({ example: 'Foto de Juan Pérez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt?: string;

}
