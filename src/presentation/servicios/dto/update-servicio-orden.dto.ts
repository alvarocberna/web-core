import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateServicioOrdenDto } from 'src/domain';

export class UpdateServicioOrdenDtoImpl implements UpdateServicioOrdenDto {
    @ApiProperty({ example: 'uuid-servicio' })
    @IsString()
    id!: string;

    @ApiProperty({ example: 1000 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    orden!: number;
}
