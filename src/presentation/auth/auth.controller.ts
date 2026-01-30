//nest
import { Controller, Req, Res, Post, Body, Query, UseGuards } from '@nestjs/common';
//express
import type { Response, Request } from 'express';
//presentation
import { AuthService } from './auth.service';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RefreshTokenGuard} from './guards/refresh-token.guard';

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
  async createUser(
    @Body() createUsuarioDto: CreateUsuarioDtoImpl, 
    @Req() req: Request,
    @Query('proyecto_id') proyecto_id: string) {
    let id_proyecto = '';
    if(proyecto_id){
      id_proyecto = proyecto_id;
    }else{
      id_proyecto = (req as any).user?.proyecto_id;
    }
    return this.authService.createUser(id_proyecto, createUsuarioDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }, 
    @Res() res: Response
  ) {
    const validated = await this.authService.validateUserByPassword(body.email, body.password);
    if (!validated) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    // lee refresh token desde cookie
    const rt = req.cookies?.refresh_token;
    if (!rt) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    // decodifica el token para obtener sub
    try {
      const decoded: any = await this.authService['jwtService'].verify(rt, { secret: process.env.JWT_REFRESH_SECRET });
      const userId = decoded.sub;
      const tokens = await this.authService.refresh(userId, rt);

      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 15*60*1000
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000
      });
      return res.json({ ok: true });
    } catch (err) {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }
  }

}
