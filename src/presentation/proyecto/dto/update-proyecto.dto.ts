import { IsBoolean, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//domain
import { UpdateProyectoDto } from "src/domain";
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class UpdateProyectoDtoImpl implements UpdateProyectoDto {
    @ApiProperty({ example: 'Mi Proyecto Web Actualizado' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    nombre_proyecto!: string;

    @ApiProperty({ example: 'Nueva descripción del proyecto' })
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
