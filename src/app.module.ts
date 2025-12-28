import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/orm/prisma/prisma.module';
import {ProyectoModule} from './presentation/proyecto/proyecto.module';
import {ArticuloModule} from './presentation/articulo/articulo.module';

@Module({
  imports: [
       PrismaModule, //prisma disponible globalmente
       ProyectoModule,
       ArticuloModule,
  ],
  exports: []
})
export class AppModule {}
