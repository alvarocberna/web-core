import { IsString } from 'class-validator';
import {CreateUsuarioDto} from 'src/domain'

export class CreateUsuarioDtoImpl implements CreateUsuarioDto {
    @IsString()
    nombre: string;
    @IsString()
    apellido: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    rol: string;
}