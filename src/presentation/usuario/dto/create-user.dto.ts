import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUsuarioDto } from 'src/domain';

export class CreateUsuarioDtoImpl implements CreateUsuarioDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    nombre: string;

    @ApiProperty({ example: 'García' })
    @IsString()
    apellido: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsString()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'USER', enum: ['ADMIN', 'USER'] })
    @IsString()
    rol: string;
}
