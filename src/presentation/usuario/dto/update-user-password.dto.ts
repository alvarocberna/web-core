import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUsuarioPasswordDto } from 'src/domain';

export class UpdateUsuarioPasswordDtoImpl implements UpdateUsuarioPasswordDto {
    @ApiProperty({ example: 'currentPassword123' })
    @IsString()
    @MinLength(12)
    @MaxLength(30)
    currentPassword: string;

    @ApiProperty({ example: 'newPassword456' })
    @IsString()
    @MinLength(12)
    @MaxLength(30)
    newPassword: string;
}
