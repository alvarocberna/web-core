//nest
import { Controller, Req, Res, Post, Body, UseGuards } from '@nestjs/common';
//express
import type { Response, Request } from 'express';
//presentation
import { AuthService } from './auth.service';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}


  //este endpoint me parece que no se está utilizando
  // @Post('register')
  // async register(@Body() createProfesionalDto: CreateProfesionalDto, @Res() res: Response) {
  //   //creamos usuario con el password hasheado
  //   const user = await this.usuarioService.createProfesional(createProfesionalDto);

  //   const { accessToken, refreshToken } = await this.authService.login({ id: user.id, email: user.correo });

  //   // set cookies
  //   res.cookie('access_token', accessToken, {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: process.env.NODE_ENV === 'production',
  //     maxAge: 15 * 60 * 1000, // 15 min
  //   });
  //   res.cookie('refresh_token', refreshToken, {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: process.env.NODE_ENV === 'production',
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //   });

  //   return res.json({ id: user.id, email: user.correo, name: user.nombre_primero + ' ' + user.apellido_paterno});
  // }

  
 @Post('create-user')
  async createUser(@Body() createUsuarioDto: CreateUsuarioDtoImpl, @Req() req: Request) {
    // const id_proyecto = (req as any).user?.proyecto_id;
    const id_proyecto = "dc11d6f6-d092-4bcd-aec9-a7cd0347a16e";
    return this.authService.createUser(id_proyecto, createUsuarioDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }, 
    @Res() res: Response
  ) {
    console.log('intentando login con: ' + body.email);
    const validated = await this.authService.validateUserByPassword(body.email, body.password);
    if (!validated) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    if (validated) console.log('validacion exitosa')

    const tokens = await this.authService.login({ id: (validated as any).id, email: body.email });

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 15*60*1000
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000
    });

    return res.json({ id: (validated as any).id, email: body.email, tokens: tokens });
  }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // suponiendo que tienes un middleware que setea req.user con sub
    const userId = (req as any).user?.sub;
    if (userId) await this.authService.logout(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.json({ ok: true });
  }

  // @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log("endpoint refresh activado")
    // lee refresh token desde cookie
    const rt = req.cookies?.refresh_token;
    console.log("refresh token: " + rt)
    if (!rt) {
      console.log("no refresh token :(")
      return res.status(401).json({ message: 'No refresh token' });
    }
    // decodifica el token para obtener sub
    try {
      console.log("iniciamos intento de refresh")
      const decoded: any = await this.authService['jwtService'].verify(rt, { secret: process.env.JWT_REFRESH_SECRET });
      console.log("decode: " + decoded)
      const userId = decoded.sub;
      console.log("userid: " + userId)
      const tokens = await this.authService.refresh(userId, rt);
      console.log("access token: " + tokens.accessToken)

      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 15*60*1000
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000
      });
      return res.json({ ok: true });
    } catch (err) {
      console.log("catch el error, token invalido")
      return res.status(401).json({ message: 'Refresh token inválido' });
    }
  }

}
