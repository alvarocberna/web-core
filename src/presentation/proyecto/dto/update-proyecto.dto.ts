import { IsString } from 'class-validator';
//domain
import { UpdateProyectoDto } from "src/domain";

export class UpdateProyectoDtoImpl implements UpdateProyectoDto {
    @IsString()
    nombre_proyecto: string;
    @IsString()
    descripcion: string;
    @IsString()
    cliente: string;
}