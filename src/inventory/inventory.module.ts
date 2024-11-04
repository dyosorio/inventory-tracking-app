import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { GlobalConfig } from '@/entities/global-config.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory-repository';
import { GlobalConfigModule } from '@/global-config/global-config.module';
import { KafkaModule } from '@/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, GlobalConfig]),
    GlobalConfigModule,
    KafkaModule,
  ],
  providers: [
    InventoryService,
    { provide: 'InventoryRepositoryInterface', useClass: InventoryRepository },
  ],
  controllers: [InventoryController],
})
export class InventoryModule {}
