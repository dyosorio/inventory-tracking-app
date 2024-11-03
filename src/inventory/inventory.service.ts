import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Inventory } from 'src/entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { AdjustStockWithThresholdDto } from './dto/adjust-stock-with-threshold.dto';
import { InventoryRepositoryInterface } from './interfaces/inventory-repository.interface';

@Injectable()
export class InventoryService {
  private thresholdPercentage: number = 30;

  constructor(
    @Inject('InventoryRepositoryInterface') 
    private readonly inventoryRepository: InventoryRepositoryInterface,
  ) {}

  async updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<void> {
    const { productId, regionId, allocation, allocationTimestamp } = updateInventoryDto;

    let existingInventory = await this.inventoryRepository.findOneByProductAndRegion(productId, regionId);

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
      existingInventory.stockBalance = allocation;
      existingInventory.allocationTimestamp = allocationTimestamp || new Date();
      await this.inventoryRepository.save(existingInventory);
    } else {
      if (allocation < 0) {
        throw new BadRequestException('Allocation must be a non-negative number.');
      }
      existingInventory = new Inventory();
      existingInventory.product = { id: productId } as any; 
      existingInventory.region = { id: regionId } as any;   
      existingInventory.allocation = allocation;
      existingInventory.stockBalance = allocation;
      existingInventory.allocationTimestamp = allocationTimestamp || new Date();
      await this.inventoryRepository.save(existingInventory);
    }
  }

  async increaseStock(adjustStockDto: AdjustStockDto): Promise<void> {
    const { productId, regionId, amount } = adjustStockDto;

    const inventory = await this.inventoryRepository.findOneByProductAndRegion(productId, regionId);
    if (!inventory) {
      throw new BadRequestException('Inventory entry not found.');
    }

    inventory.increaseStock(amount);
    await this.inventoryRepository.save(inventory);
  }

  async decreaseStock(adjustStockDto: AdjustStockWithThresholdDto): Promise<void> {
    const { productId, regionId, amount, thresholdPercentage } = adjustStockDto;

    const inventory = await this.inventoryRepository.findOneByProductAndRegion(productId, regionId);
    if (!inventory) {
      throw new BadRequestException('Inventory entry not found.');
    }

    // Determine the threshold value based on the provided or default percentage
    const threshold = thresholdPercentage || 30;
    const thresholdValue = (inventory.allocation * threshold) / 100;

    if (inventory.stockBalance - amount < thresholdValue) {
      console.log(`Stock level below the ${threshold}% threshold for ${productId} in ${regionId}`);
    }    

    try {
      inventory.decreaseStock(amount);
      inventory.stockBalance -= amount;
      await this.inventoryRepository.save(inventory);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setThreshold(thresholdPercentage: number): Promise<void> {
    if (thresholdPercentage < 0 || thresholdPercentage > 100) {
      throw new BadRequestException('Threshold percentage must be between 0 and 100.');
    }
    this.thresholdPercentage = thresholdPercentage;
  }

  async getAllInventory(): Promise<Inventory[]> {
    return this.inventoryRepository.findAll();
  }

  async clearAllInventory(): Promise<void> {
    await this.inventoryRepository.clearAll();
  }

  async findOneByProductAndRegion(productId: string, regionId: string): Promise<Inventory | null> {
    return this.inventoryRepository.findOneByProductAndRegion(productId, regionId);
  }

  async save(inventory: Inventory): Promise<Inventory> {
    return this.inventoryRepository.save(inventory);
  }  
}