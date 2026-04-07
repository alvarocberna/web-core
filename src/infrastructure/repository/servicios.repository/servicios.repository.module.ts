import { Module } from '@nestjs/common';
import { ServiciosRepositoryService } from './servicios.repository.service';
import { ServiciosDatasourceModule } from 'src/infrastructure/datasources/servicios.datasource/servicios.datasource.module';

@Module({
    imports: [ServiciosDatasourceModule],
    providers: [ServiciosRepositoryService],
    exports: [ServiciosRepositoryService],
})
export class ServiciosRepositoryModule {}
