import { IsEnum, IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUsuarioDto } from 'src/domain';
import { Rol } from 'src/domain/enums/rol.enum';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class UpdateUsuarioDtoImpl implements UpdateUsuarioDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido?: string;

    @ApiPropertyOptional({ example: 'juan@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(254)
    email?: string;

    @ApiPropertyOptional({ example: 'USER', enum: Rol })
    @IsOptional()
    @IsEnum(Rol)
    rol?: Rol;
}
