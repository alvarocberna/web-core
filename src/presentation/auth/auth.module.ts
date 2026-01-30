import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsuarioRepositoryModule } from 'src/infrastructure/repository/usuario.repository/usuario.repository.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
  imports: [UsuarioRepositoryModule, JwtModule, ConfigModule, 
    JwtModule.register({global: true}),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenGuard],
  exports: [AuthService, JwtStrategy, RefreshTokenGuard]
})
export class AuthModule {}
