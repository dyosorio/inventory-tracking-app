import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  providers: [
    InventoryService,
    { provide: 'InventoryRepositoryInterface', useClass: InventoryRepository },
  ],
  controllers: [InventoryController],
})
export class InventoryModule {}
