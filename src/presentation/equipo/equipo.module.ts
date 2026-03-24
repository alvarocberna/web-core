import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { EquipoRepositoryModule } from 'src/infrastructure/repository/equipo.repository/equipo.repository.module';
import { ImageStorageRepositoryModule } from 'src/infrastructure';

@Module({
    imports: [EquipoRepositoryModule, ImageStorageRepositoryModule, ConfigModule],
    controllers: [EquipoController],
    providers: [EquipoService],
    exports: [EquipoService],
})
export class EquipoModule {}
