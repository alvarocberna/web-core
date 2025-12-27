/*
  Este servicio expone el cliente de Prisma y se encarga de manejar la conexión y desconexión
  a la base de datos cuando el módulo de NestJS se inicia y se destruye, respectivamente.
*/

//nest
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
//prisma
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const { PrismaClient } = require('../../../../generated/prisma/client');
import { PrismaClient } from '../../../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// // import { PrismaClient } from '../generated/prisma/client'
// import { PrismaClient } from '../../../../generated/prisma/client';

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }
