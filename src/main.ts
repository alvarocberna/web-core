import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
var cookieParser = require('cookie-parser')
import {HttpExceptionFilter} from './presentation/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //helmet - corregimos headers vulnerables
  app.disable('x-powered-by');
  app.use(helmet());

  const configService = app.get(ConfigService);

  // Servir archivos estáticos desde uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(cookieParser());

  app.enableCors({
    origin: configService.get<string>('URL_FRONTEND'), 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

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
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
