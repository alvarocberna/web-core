import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//domain
import { CreateProyectoDto } from "src/domain";

export class CreateProyectoDtoImpl implements CreateProyectoDto {
    @ApiProperty({ example: 'Mi Proyecto Web' })
    @IsString()
    nombre_proyecto: string;

    @ApiProperty({ example: 'Descripción del proyecto' })
    @IsString()
    descripcion: string;

    @ApiProperty({ example: 'Nombre del Cliente' })
    @IsString()
    cliente: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;
}
