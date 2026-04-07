import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { ServiciosRepositoryModule } from 'src/infrastructure/repository/servicios.repository/servicios.repository.module';
import { ImageStorageRepositoryModule } from 'src/infrastructure';
import { UsuarioRepositoryModule } from 'src/infrastructure';

@Module({
    imports: [ServiciosRepositoryModule, ImageStorageRepositoryModule, UsuarioRepositoryModule, ConfigModule],
    controllers: [ServiciosController],
    providers: [ServiciosService],
    exports: [ServiciosService],
})
export class ServiciosModule {}
