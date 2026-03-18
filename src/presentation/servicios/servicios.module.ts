import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { ServiciosRepositoryModule } from 'src/infrastructure/repository/servicios.repository/servicios.repository.module';

@Module({
    imports: [ServiciosRepositoryModule],
    controllers: [ServiciosController],
    providers: [ServiciosService],
    exports: [ServiciosService],
})
export class ServiciosModule {}
