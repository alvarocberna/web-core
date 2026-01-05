import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsuarioRepositoryModule } from 'src/infrastructure/repository/usuario.repository/usuario.repository.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsuarioRepositoryModule, JwtModule, ConfigModule, 
    JwtModule.register({global: true}),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
