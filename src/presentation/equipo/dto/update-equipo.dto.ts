import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateEquipoDto } from 'src/domain';

export class UpdateEquipoDtoImpl implements UpdateEquipoDto {
    @ApiProperty({ example: 'Nuestro Equipo' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo: string;

    @ApiPropertyOptional({ example: 'Conoce a las personas detrás del proyecto' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion: string | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;
}
