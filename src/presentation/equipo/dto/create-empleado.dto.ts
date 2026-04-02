import { IsInt, IsBoolean, IsOptional, IsString, IsNumber, MinLength, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmpleadoDto, CreateSecEmpleadoDto } from 'src/domain';
//sanitize
import { Sanitize, SanitizeRich, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class CreateSecEmpleadoDtoImpl implements CreateSecEmpleadoDto {
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


export class CreateEmpleadoDtoImpl implements CreateEmpleadoDto {
    @ApiProperty({ example: 'Juan' })
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
    nombre_segundo!: string | null;

    @ApiProperty({ example: 'Pérez' })
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
    apellido_materno!: string | null;

    @ApiProperty({ example: 'Desarrollador' })
    @Sanitize()
    @IsString()
    @MaxLength(200)
    profesion!: string | null;

    @ApiPropertyOptional({ example: 'Frontend' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(200)
    especialidad!: string | null;

    @ApiPropertyOptional({ example: 'Especialista en interfaces de usuario' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion!: string | null;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orden!: number | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiPropertyOptional({ example: 'juan-perez' })
    @Sanitize()
    @IsString()
    @MaxLength(300)
    slug!: string | null;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
    @IsOptional()
    @SanitizeUrl()
    @IsString()
    @MaxLength(500)
    img_url!: string | null;

    @ApiPropertyOptional({ example: 'Foto de Juan Pérez' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(100)
    img_alt!: string | null;

    @ApiProperty({ type: [CreateSecEmpleadoDtoImpl] })
    @ValidateNested()
    @Type(() => CreateSecEmpleadoDtoImpl)
    sec_empleado!: CreateSecEmpleadoDtoImpl[];

}
