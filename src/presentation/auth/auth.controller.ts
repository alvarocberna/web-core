//nest
import { Controller, Req, Res, Post, Body, Query, UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
//express
import type { Response, Request } from 'express';
//presentation
import { AuthService } from './auth.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RefreshTokenGuard} from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  //que hace esto?
  private isHttpsRequest(req: Request): boolean {
    const forwardedProto = req.headers['x-forwarded-proto'];

    if (Array.isArray(forwardedProto)) {
      return forwardedProto.some((value) => value.toLowerCase().includes('https'));
    }

    if (typeof forwardedProto === 'string') {
      return forwardedProto
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .includes('https');
    }

    return req.secure;
  }

  //que hace esto?
  private logCookieDiagnostics(context: 'login' | 'refresh', req: Request) {
    const nodeEnv = process.env.NODE_ENV ?? 'undefined';
    const secureCookie = nodeEnv === 'production';
    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedProtoValue = Array.isArray(forwardedProto)
      ? forwardedProto.join(',')
      : forwardedProto ?? 'n/a';

    this.logger.log(
      `[${context}] NODE_ENV=${nodeEnv} secureCookie=${secureCookie} sameSite=lax req.secure=${req.secure} x-forwarded-proto=${forwardedProtoValue}`,
    );

    if (secureCookie && !this.isHttpsRequest(req)) {
      this.logger.warn(
        `[${context}] Cookie segura en producción, pero la request no parece HTTPS. El navegador puede no reenviar la cookie.`,
      );
    }
  }


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

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login exitoso. Devuelve tokens y establece cookies.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response
  ) {

    const nodeEnv = (this.configService.get<string>('NODE_ENV'))?.toLowerCase();
    const isProd = nodeEnv === 'production';
    const cookieSameSite: 'none' | 'lax' = isProd ? 'none' : 'lax';
    const cookieSecure = isProd;

    const validated = await this.authService.validateUserByPassword(body.email, body.password);
    if (!validated) {
      this.logger.warn(`[login] Intento fallido para: ${body.email}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    this.logger.log(`[login] Login exitoso: ${body.email}`);
    const tokens = await this.authService.login({ id: (validated as any).id, email: body.email });

    this.logCookieDiagnostics('login', req);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: cookieSecure,
      maxAge: 15*60*1000,
      // path: '/',
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: cookieSecure,
      maxAge: 7*24*60*60*1000,
      // path: '/auth/refresh',
    });

    // res.cookie('access_token', tokens.accessToken, {
    //   httpOnly: true, sameSite: 'none', secure: true, maxAge: 15*60*1000
    // });
    // res.cookie('refresh_token', tokens.refreshToken, {
    //   httpOnly: true, sameSite: 'none', secure: true, maxAge: 7*24*60*60*1000
    // });

    const setCookieHeader = res.getHeader('set-cookie');
    const setCookieCount = Array.isArray(setCookieHeader) ? setCookieHeader.length : setCookieHeader ? 1 : 0;
    this.logger.log(`[login] Set-Cookie headers enviados: ${setCookieCount}`);

    return res.json({ id: (validated as any).id, email: body.email, tokens: tokens });
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada. Cookies eliminadas.' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const userId = (req as any).user?.sub;
    if (userId) {
      await this.authService.logout(userId);
      this.logger.log(`[logout] Sesión cerrada para userId: ${userId}`);
    }
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.json({ ok: true });
  }

  // @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Renovar access token usando refresh token (cookie)' })
  @ApiResponse({ status: 200, description: 'Tokens renovados. Nuevas cookies establecidas.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o ausente' })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    // lee refresh token desde las cookies
    const rt = req.cookies?.refresh_token;
    if (!rt) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    // decodifica el token para obtener sub
    try {
      const decoded = this.authService.verifyRefreshToken(rt);
      const userId = decoded.sub;
      if (!userId) {
        return res.status(401).json({ message: 'Refresh token inválido' });
      }
      const tokens = await this.authService.refresh(userId, rt);

      this.logger.log(`[refresh] Token renovado para userId: ${userId}`);
      this.logCookieDiagnostics('refresh', req);

      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 15*60*1000
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000
      });

      const setCookieHeader = res.getHeader('set-cookie');
      const setCookieCount = Array.isArray(setCookieHeader) ? setCookieHeader.length : setCookieHeader ? 1 : 0;
      this.logger.log(`[refresh] Set-Cookie headers enviados: ${setCookieCount}`);

      return res.json({ ok: true });
    } catch (err) {
      this.logger.warn(`[refresh] Token inválido o expirado: ${(err as Error).message}`);
      return res.status(401).json({ message: 'Refresh token inválido' });
    }
  }

}
