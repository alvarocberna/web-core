import { IsEnum, IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUsuarioDto } from 'src/domain';
import { Rol } from 'src/domain/enums/rol.enum';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreateUsuarioDtoImpl implements CreateUsuarioDto {
    @ApiProperty({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    nombre: string;

    @ApiProperty({ example: 'García' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    apellido: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(12)
    @MaxLength(30)
    password: string;

    @ApiProperty({ example: 'USER', enum: Rol })
    @IsEnum(Rol)
    rol: Rol;

    @ApiPropertyOptional({ example: 'https://web-core-storage.s3.us-east-1.amazonaws.com/uploads/images/image-123456789.png' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    img_url: string | null;

    @ApiPropertyOptional({ example: 'imagen alternativa' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    img_alt: string | null;
}
