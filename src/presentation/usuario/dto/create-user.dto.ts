import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUsuarioDto } from 'src/domain';

export class CreateUsuarioDtoImpl implements CreateUsuarioDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre: string;

    @ApiProperty({ example: 'García' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiProperty({ example: 'USER', enum: ['ADMIN', 'USER'] })
    @IsString()
    rol: string;
}
