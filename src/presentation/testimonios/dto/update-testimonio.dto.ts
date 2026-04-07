import { IsEnum, IsString, IsEmail, IsInt, IsBoolean, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTestimonioDto } from 'src/domain';
import { TestimonioStatus } from 'src/domain/enums/testimonio-status.enum';
//sanitize
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class UpdateTestimonioDtoImpl implements UpdateTestimonioDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    nombre?: string;

    @ApiPropertyOptional({ example: 'García' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(50)
    apellido?: string;

    @ApiPropertyOptional({ example: 'juan@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    correo?: string;

    @ApiPropertyOptional({ example: 'Excelente servicio, muy recomendado.' })
    @IsOptional()
    @Sanitize()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsOptional()
    @IsInt()
    @Max(5)
    calificacion?: number;

    @ApiPropertyOptional({ example: 'pending', enum: TestimonioStatus })
    @IsOptional()
    @IsEnum(TestimonioStatus)
    status?: TestimonioStatus;
}
