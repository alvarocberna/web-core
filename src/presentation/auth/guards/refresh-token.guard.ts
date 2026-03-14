import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/*
Verifica 1) si el RT existe, y 2) si la firma del RT
(JWT_REFRESH_SECRET) coincide con la definida en el backend.
Si todo coincide, devuelve la info del usuario
*/

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new UnauthorizedException('No refresh token');

    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || process.env.JWT_REFRESH_SECRET;
      const decoded = this.jwtService.verify(rt, { secret });
      (req as any).user = decoded; // attach decoded payload (sub, email)
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
