import { IsString, IsEmail, IsInt, IsBoolean, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTestimonioDto } from 'src/domain';

export class UpdateTestimonioDtoImpl implements UpdateTestimonioDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre: string;

    @ApiProperty({ example: 'García' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    @MaxLength(254)
    correo: string;

    @ApiProperty({ example: 'Excelente servicio, muy recomendado.' })
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    descripcion: string;

    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    calificacion: number | null;

    @ApiProperty({ example: true, description: 'Aprobado para mostrarse públicamente' })
    @IsBoolean()
    aprobado: boolean;
}
