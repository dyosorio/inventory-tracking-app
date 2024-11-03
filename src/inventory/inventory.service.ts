import { Injectable, BadRequestException } from '@nestjs/common';
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

    let existingInventory = await this.inventoryRepository.findOne({
        where: {
          product: { id: productId },
          region: { id: regionId }
        },
        relations: ['product', 'region'],
    });
    if (existingInventory) {
      //Check if the new allocation is the same as the current allocation
      if (existingInventory.allocation === allocation) {
        throw new BadRequestException('The new allocation is the same as the current allocation. No update required.');
      }

      //Check for Negative Allocation
      if (allocation < 0) {
        throw new BadRequestException('Allocation must be a non-negative number.');

      }
      existingInventory.allocation = allocation;
      existingInventory.allocationTimestamp = allocationTimestamp || new Date();
      await this.inventoryRepository.save(existingInventory);
    } else {
      if (allocation < 0) {
        throw new BadRequestException('Allocation must be a non-negative number.');
      }

      existingInventory = this.inventoryRepository.create({
        product: { id: productId } as any, 
        region: { id: regionId } as any, 
        allocation,
        allocationTimestamp: allocationTimestamp || new Date(),
      });
      await this.inventoryRepository.save(existingInventory);
    }
  }

  async getAllInventory(): Promise<Inventory[]> {
    return this.inventoryRepository.find({ relations: ['product', 'region'] });
  }
}