import { IsString, IsEmail, IsInt, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTestimonioDto } from 'src/domain';

export class CreateTestimonioDtoImpl implements CreateTestimonioDto {
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
}
