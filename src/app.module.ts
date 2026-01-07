//nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //permite llamar env var
//infrastructure
import { PrismaModule } from './infrastructure/orm/prisma/prisma.module';
//presentation
import {ProyectoModule} from './presentation/proyecto/proyecto.module';
import {ArticuloModule} from './presentation/articulo/articulo.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UsuarioModule } from './presentation/usuario/usuario.module';
import {ActividadModule} from "./presentation/actividad/actividad.module"

@Module({
  imports: [
       PrismaModule, //prisma disponible globalmente
       ConfigModule,
       ProyectoModule,
       ArticuloModule,
       AuthModule,
       UsuarioModule,
       ActividadModule,
  ],
  exports: []
})
export class AppModule {}
