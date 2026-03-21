import { IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateArticulosDto } from 'src/domain';

export class UpdateArticulosDtoImpl implements UpdateArticulosDto {
    @ApiProperty({ example: 'Artículos' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo: string;

    @ApiPropertyOptional({ example: 'Sección de artículos del proyecto' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion: string | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    aprobar: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    notificacion: boolean;
}
