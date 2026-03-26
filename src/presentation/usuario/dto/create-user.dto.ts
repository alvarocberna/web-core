import { IsEnum, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUsuarioDto } from 'src/domain';
import { Rol } from 'src/domain/enums/rol.enum';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreateUsuarioDtoImpl implements CreateUsuarioDto {
    @ApiProperty({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre: string;

    @ApiProperty({ example: 'García' })
    @Sanitize()
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

    @ApiProperty({ example: 'USER', enum: Rol })
    @IsEnum(Rol)
    rol: Rol;
}
