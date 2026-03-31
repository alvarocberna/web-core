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
    @MaxLength(50)
    nombre?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    apellido?: string;

    @ApiPropertyOptional({ example: 'juan@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    email?: string;

    @ApiPropertyOptional({ example: 'USER', enum: Rol })
    @IsOptional()
    @IsEnum(Rol)
    rol?: Rol;

    @ApiPropertyOptional({ example: 'https://web-core-storage.s3.us-east-1.amazonaws.com/uploads/images/image-123456789.png' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    img_url?: string;

    @ApiPropertyOptional({ example: 'imagen alternativa' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    img_alt?: string;
}
