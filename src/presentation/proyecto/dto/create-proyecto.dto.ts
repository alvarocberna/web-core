import { IsBoolean, IsString, MinLength, MaxLength } from 'class-validator';
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
}
