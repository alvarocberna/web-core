import { IsBoolean, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//domain
import { CreateProyectoDto } from "src/domain";
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreateProyectoDtoImpl implements CreateProyectoDto {
    @ApiProperty({ example: 'Mi Proyecto Web' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_proyecto!: string;

    @ApiProperty({ example: 'Descripción del proyecto' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    descripcion!: string;

    @ApiProperty({ example: 'Nombre del Cliente' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    cliente!: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    equipo_habilitado!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    servicios_habilitado!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    articulos_habilitado!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    testimonios_habilitado!: boolean;

    @ApiProperty({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre!: string;

    @ApiProperty({ example: 'Pérez' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido!: string;

    @ApiProperty({ example: 'juan@example.com' })
    @Sanitize()
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password!: string;

    @ApiProperty({ example: 'admin' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    rol!: string;
}
