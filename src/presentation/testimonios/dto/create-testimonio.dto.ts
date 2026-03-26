import { IsEnum, IsString, IsEmail, IsInt, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTestimonioDto } from 'src/domain';
import { TestimonioStatus } from 'src/domain/enums/testimonio-status.enum';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreateTestimonioDtoImpl implements CreateTestimonioDto {
    @ApiProperty({ example: 'Juan' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nombre: string;

    @ApiProperty({ example: 'García' })
    @Sanitize()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    apellido: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    @MaxLength(254)
    correo: string;

    @ApiProperty({ example: 'Excelente servicio, muy recomendado.' })
    @Sanitize()
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

    @ApiProperty({ example: 'pending', enum: TestimonioStatus })
    @IsEnum(TestimonioStatus)
    status: TestimonioStatus;
}
