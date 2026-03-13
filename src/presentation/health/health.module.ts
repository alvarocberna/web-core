//nest
import { Module } from '@nestjs/common';
//presentation
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
