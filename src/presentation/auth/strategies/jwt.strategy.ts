//nest
import { Injectable } from '@nestjs/common';
//nest - passport
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
//nest - config
import { ConfigService } from '@nestjs/config';
//presentation
import { UsuarioRepositoryService } from '../../../infrastructure/repository/usuario.repository/usuario.repository.service';

/*
  Extrae el access_token de las cookies (16-21)
  Se valida el access_token y el secret (30-33)
  Ya validado, devuelve la info del usuario (36-41)
*/

const cookieExtractor = (req: any) => {
  if (req && req.cookies) {
    return req.cookies['access_token']; 
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usuarioService: UsuarioRepositoryService,
    private configService: ConfigService,
  ) {
    super({ 
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usuarioService.getUsuarioById(payload.sub);
    if (!user) return null;
    const { password, hashedRt, ...rest } = user;

    const proyecto_id = payload.proyecto_id ?? rest.proyecto_id;
    const rol = payload.rol ?? rest.rol;

    return { ...rest, proyecto_id, rol };
  }
}