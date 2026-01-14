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
    En este archivo se define la estrategia de autenticación para la aplicación, 
    utilizando JWT y la librería passport. El proposito principal es proteger rutas
    asegurando que solo los usuarios con un token valido puedan acceder a ellas.
*/

//extraemos el token desde las cookies cada vez que se hace un request
const cookieExtractor = (req: any) => {
  if (req && req.cookies) {
    return req.cookies['access_token']; // el nombre debe coincidir con el que setearon en el login
  }
  return null;
};

/*
    Injectable marca la clase para que pueda ser gestionada por el sistema de inyección de dependencias
    esto permite que otros modulos como authmodule la puedan utilizar
*/
@Injectable()
/*tenemos PassportStrategy y se especializa con la Strategy importada de passport-jwt
  al extender de passportstrategy le decimos a passport: aquí tienes una estrategia
  de auth llamada 'jwt (nombre por defecto que le da passport-jwt), esta estrategia queda 
  registrada en el contenedor de dependencias de nest esperando ser utilizada
  (pero igual necesito importarla en el modulo auth para q funcione, q onda? o cualquiera sirve?)
*/
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usuarioService: UsuarioRepositoryService,
    private configService: ConfigService,
  ) {
    super({ //aquí se configura la estrategia JWT
      //para encontrar los tokens usa la fn aux cookieExtractor
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      //clave secreta para verificar la firma del jwt
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  /*
   Corazon de la estrategia
   Una vez que passport verifica que el token es valido, extrae su contenido  (payload)
   y ejecuta la función validate
  */
  async validate(payload: any) {
    /*
      payload: objeto que se codificó dentro del jwt al iniciar sesión, contiene info del 
      usuario como el id. Payload.sub significa subject.
    */
    const user = await this.usuarioService.getUsuarioById(payload.sub);
    if (!user) return null; //Passport dispara automáticamente un 401 Unauthorized.
    /*medida de seguridad importante: se extraen y descartan propiedades sensibles 
    como passport y hashedrt*/
    const { password, hashedRt, ...rest } = user;
    /*se retorna info del user. Lo que retorna esta fn se adjunta al
    objeto request en todas las rutas protegidas por el Guar JwtAuthGuard*/
    return rest; // ← esto se adjunta a req.user
  }
}

/*
DUDAS:
1 - como se ubica el JwtStrategy en el contexto e la app, es como un middleware?
    se supone que queda registrado en el contendor de dependencias de nest de forma
    automática para ser utilizado, pero igual necesité importanlo en auth para q funcione
    entonces debe ser importado como provider? siempre en el modulo del guard o auth?
    o cualquier modulo sirve?
    R: Se debe configurar como un provider del módulo que se encarga de la auth
*/