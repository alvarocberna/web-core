import { IsString, IsDate, IsNumber } from 'class-validator';
import {CreateUsuarioDto} from 'src/domain'

export class CreateUsuarioDtoImpl{
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