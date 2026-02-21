import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
var cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit');
import {HttpExceptionFilter} from './presentation/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  
  const configService = app.get(ConfigService);

  const url_frontend = configService.get<string>('URL_FRONTEND');

  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //helmet - corregimos headers vulnerables
  app.disable('x-powered-by');
  app.use(helmet());


  // Servir archivos estáticos desde uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(cookieParser());

  const authLimiter = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    // max: 10, // limit each IP to 10 requests per window per route
    // standardHeaders: true,
    // legacyHeaders: false,
    // message: 'Too many requests from this IP, please try again later.'
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.method === 'OPTIONS', // 👈 CLAVE
  });

  // Apply limiter to sensitive auth routes
  app.use('/auth/login', authLimiter);
  app.use('/auth/create-user', authLimiter);

    //habilitamos Prisma Filter personalizado para manejar exceptions de Prisma
  app.useGlobalFilters(new HttpExceptionFilter());
  //habilitamos los pipes de nest para convertir tipos de datos en el DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // ignora propiedades que no están en el DTO
      forbidNonWhitelisted: true, 
      transform: true,        // 👈 transforma tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true, // 👈 convierte strings a number/date si el tipo del DTO lo pide
        },
      }),
  );
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
