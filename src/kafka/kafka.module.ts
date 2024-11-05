import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}