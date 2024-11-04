import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from '@/entities/global-config.entity';
import { GlobalConfigService } from './global-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalConfig])],
  providers: [GlobalConfigService],
  exports: [GlobalConfigService],
})
export class GlobalConfigModule {}
