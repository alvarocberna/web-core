//nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
//presentation
//infrastructure
import { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';
//paquetes
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
      private usuarioService: UsuarioRepositoryService,
      private jwtService: JwtService,
      private configService: ConfigService,
  ){}

  async validateUserByPassword(email: string, pass: string) {
    const user = await this.usuarioService.getUsuarioByEmail(email);
    if (!user) {
      return null;
    }
    console.log('user encontrado: ' + user.nombre + ' ' + user.apellido)
    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) {
      return null;
    }
    console.log('hay match en el password')
    // omit password when returning
    const { password, hashedRt, ...rest } = user;
    return rest;
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
    // hash refresh token and store in DB
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_OR_ROUNDS');
    const hashedRt = await bcrypt.hash(refreshToken, +saltRounds!);
    await this.usuarioService.setRefreshToken(user.id, hashedRt);
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.usuarioService.removeRefreshToken(userId);
  }

  verifyRefreshToken(rt: string): { sub: string; email: string } {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new UnauthorizedException('JWT_REFRESH_SECRET no configurado');
    return this.jwtService.verify<{ sub: string; email: string }>(rt, { secret });
  }

  async refresh(userId: string, rt: string) {
    const user = await this.usuarioService.getUsuarioById(userId);
    if (!user || !user.hashedRt){ //el user.hashdRt es NULL ! AQUI ESTÁ EL ERROR
        throw new UnauthorizedException();
    } 
    const isMatch = await bcrypt.compare(rt, user.hashedRt);
    if (!isMatch) throw new UnauthorizedException();
    // create new tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_OR_ROUNDS');
    const newHashedRt = await bcrypt.hash(refreshToken, +saltRounds!);
    await this.usuarioService.setRefreshToken(user.id, newHashedRt);
    return { accessToken, refreshToken };
  }

}
