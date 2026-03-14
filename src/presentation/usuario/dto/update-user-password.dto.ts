import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUsuarioPasswordDto } from 'src/domain';

export class UpdateUsuarioPasswordDtoImpl implements UpdateUsuarioPasswordDto {
    @ApiProperty({ example: 'currentPassword123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    currentPassword: string;

    @ApiProperty({ example: 'newPassword456' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    newPassword: string;
}
