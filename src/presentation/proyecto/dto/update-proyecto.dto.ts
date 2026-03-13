import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//domain
import { UpdateProyectoDto } from "src/domain";

export class UpdateProyectoDtoImpl implements UpdateProyectoDto {
    @ApiProperty({ example: 'Mi Proyecto Web Actualizado' })
    @IsString()
    nombre_proyecto: string;

    @ApiProperty({ example: 'Nueva descripción del proyecto' })
    @IsString()
    descripcion: string;

    @ApiProperty({ example: 'Nombre del Cliente' })
    @IsString()
    cliente: string;
}
