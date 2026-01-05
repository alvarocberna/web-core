//nest
import { Module } from '@nestjs/common';
import { UsuarioRepositoryService } from './usuario.repository.service';
import { UsuarioDatasourceModule } from 'src/infrastructure/datasources/usuario.datasource/usuario.datasource.module';

@Module({
  imports: [UsuarioDatasourceModule],
  providers: [UsuarioRepositoryService],
  exports: [UsuarioRepositoryService]
})
export class UsuarioRepositoryModule {}
