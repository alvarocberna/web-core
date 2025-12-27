import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/orm/prisma/prisma.module';
import {ProyectoModule} from './presentation/proyecto/proyecto.module';

@Module({
  imports: [
       PrismaModule, //prisma disponible globalmente
       ProyectoModule,
  ],
  exports: []
})
export class AppModule {}
