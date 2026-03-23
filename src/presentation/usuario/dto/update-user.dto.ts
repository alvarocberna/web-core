import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUsuarioDto } from 'src/domain';

export class UpdateUsuarioDtoImpl implements UpdateUsuarioDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido?: string;

    @ApiPropertyOptional({ example: 'juan@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(254)
    email?: string;

    @ApiPropertyOptional({ example: 'USER' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    rol?: string;
}
