//nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //permite llamar env var
import * as Joi from 'joi';
//infrastructure
import { PrismaModule } from './infrastructure/orm/prisma/prisma.module';
//presentation
import {ProyectoModule} from './presentation/proyecto/proyecto.module';
import {ArticuloModule} from './presentation/articulo/articulo.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UsuarioModule } from './presentation/usuario/usuario.module';
import {ActividadModule} from "./presentation/actividad/actividad.module"
import { HealthModule } from './presentation/health/health.module'

const envValidationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('900s'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // Auth
  BCRYPT_SALT_OR_ROUNDS: Joi.number().default(10),

  // AWS (opcionales si se usa storage local)
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),

  // CORS
  URL_FRONTEND: Joi.string().uri().optional(),
});

@Module({
  imports: [
       PrismaModule, //prisma disponible globalmente
       ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidationSchema,
          validationOptions: {
            abortEarly: false, // muestra todos los errores juntos, no solo el primero
          },
        }),
       AuthModule,
       ProyectoModule,
       ArticuloModule,
       UsuarioModule,
       ActividadModule,
       HealthModule,
  ],
  exports: []
})
export class AppModule {}
