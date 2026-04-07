import { IsInt, IsBoolean, IsOptional, IsString, IsNumber, MinLength, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateEmpleadoDto, UpdateSecEmpleadoDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeUrl, SanitizeRich } from 'src/common/decorators/sanitize.decorator';

export class UpdateSecEmpleadoDtoImpl implements UpdateSecEmpleadoDto {
    @ApiProperty({ example: 'uuid-de-la-seccion' })
    @IsString()
    id!: string;

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

export class UpdateEmpleadoDtoImpl implements UpdateEmpleadoDto {
    @ApiProperty({ example: 'uuid-empleado' })
    @IsString()
    id!: string;

    @ApiPropertyOptional({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    nombre_primero!: string;

    @ApiPropertyOptional({ example: 'Carlos' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    nombre_segundo!: string;

    @ApiPropertyOptional({ example: 'Pérez' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    apellido_paterno!: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    apellido_materno!: string;

    @ApiPropertyOptional({ example: 'Desarrollador' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    profesion!: string;

    @ApiPropertyOptional({ example: 'Frontend' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    especialidad!: string;

    @ApiPropertyOptional({ example: 'Especialista en interfaces de usuario' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion!: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden!: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug!: string;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url!: string;

    @ApiPropertyOptional({ example: 'Foto de Juan Pérez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt!: string;

    @ApiProperty({ type: [UpdateSecEmpleadoDtoImpl] })
    @ValidateNested()
    @Type(() => UpdateSecEmpleadoDtoImpl)
    sec_empleado!: UpdateSecEmpleadoDtoImpl[];

}
