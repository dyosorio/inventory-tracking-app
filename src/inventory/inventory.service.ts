import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from 'src/entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<void> {
    const { productId, regionId, allocation, allocationTimestamp } = updateInventoryDto;

    const existingInventory = await this.inventoryRepository.findOne({
        where: {
            product: { id: productId },
            region: { id: regionId }
        },
        relations: ['product', 'region'],
    });
    if (existingInventory) {
        existingInventory.allocation = allocation;
        existingInventory.allocationTimestamp = allocationTimestamp;
        await this.inventoryRepository.save(existingInventory);
    } else {
        throw new Error('Inventory entry not found');
    }
  }
}