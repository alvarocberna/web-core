import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUsuarioInfoDto } from 'src/domain';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class UpdateUsuarioInfoDtoImpl implements UpdateUsuarioInfoDto {
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
}
