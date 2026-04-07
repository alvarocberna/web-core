import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTestimoniosDto } from 'src/domain';

export class UpdateTestimoniosDtoImpl implements UpdateTestimoniosDto {
    @ApiPropertyOptional({ example: 'Lo que dicen nuestros clientes' })
    @IsString()
    @MaxLength(200)
    titulo?: string;

    @ApiPropertyOptional({ example: 'Opiniones de clientes satisfechos' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    activo?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    aprobar?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    notificacion?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    habilitado?: boolean;
}
