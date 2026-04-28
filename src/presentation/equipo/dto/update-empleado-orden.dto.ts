import { IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateEmpleadoOrdenDto } from 'src/domain';

export class UpdateEmpleadoOrdenDtoImpl implements UpdateEmpleadoOrdenDto {
    @ApiProperty({ example: 'uuid-empleado' })
    @IsString()
    id!: string;

    @ApiProperty({ example: 1000 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    orden!: number;
}
