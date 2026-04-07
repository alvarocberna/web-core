import { Module } from '@nestjs/common';
import { EquipoRepositoryService } from './equipo.repository.service';
import { EquipoDatasourceModule } from 'src/infrastructure/datasources/equipo.datasource/equipo.datasource.module';

@Module({
    imports: [EquipoDatasourceModule],
    providers: [EquipoRepositoryService],
    exports: [EquipoRepositoryService],
})
export class EquipoRepositoryModule {}
