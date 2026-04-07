import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTestimoniosDto } from 'src/domain';

export class CreateTestimoniosDtoImpl implements CreateTestimoniosDto {
    @ApiProperty({ example: 'Lo que dicen nuestros clientes' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo!: string;

    @ApiPropertyOptional({ example: 'Opiniones de clientes satisfechos' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion!: string | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    activo!: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    aprobar!: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    notificacion!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    habilitado!: boolean;
}
