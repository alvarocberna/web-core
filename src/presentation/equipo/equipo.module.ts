import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { EquipoRepositoryModule } from 'src/infrastructure/repository/equipo.repository/equipo.repository.module';

@Module({
    imports: [EquipoRepositoryModule],
    controllers: [EquipoController],
    providers: [EquipoService],
    exports: [EquipoService],
})
export class EquipoModule {}
