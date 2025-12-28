import { IsString } from 'class-validator';
//domain
import { CreateProyectoDto } from "src/domain";

export class CreateProyectoDtoImpl implements CreateProyectoDto {
    @IsString()
    nombre_proyecto: string;
    @IsString()
    descripcion: string;
    @IsString()
    cliente: string;
}
