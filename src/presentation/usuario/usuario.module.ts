import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioRepositoryModule } from 'src/infrastructure/repository/usuario.repository/usuario.repository.module';

@Module({
  imports: [UsuarioRepositoryModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule {}
