import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Inventory } from '@/entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { InventoryRepositoryInterface } from './interfaces/inventory-repository.interface';
import { GlobalConfigService } from '@/global-config/global-config.service';
import { KafkaService } from '@/kafka/kafka.service'; 

@Injectable()
export class InventoryService {
  constructor(
    @Inject('InventoryRepositoryInterface') 
    private readonly inventoryRepository: InventoryRepositoryInterface,
    private readonly globalConfigService: GlobalConfigService,
    private readonly kafkaService: KafkaService,
  ) {}

  async updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<void> {
    const { productId, regionId, allocation, allocationTimestamp } = updateInventoryDto;

    let existingInventory = await this.inventoryRepository.findOneByProductAndRegion(productId, regionId);

    if (existingInventory) {
      if (existingInventory.allocation === allocation) {
        throw new BadRequestException('The new allocation is the same as the current allocation. No update required.');
      }

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

  async decreaseStock(adjustStockDto: AdjustStockDto): Promise<void> {
    const { productId, regionId, amount } = adjustStockDto;

    const inventory = await this.inventoryRepository.findOneByProductAndRegion(productId, regionId);
    if (!inventory) {
      throw new BadRequestException('Inventory entry not found.');
    }

    const globalConfig = await this.globalConfigService.getConfig();
    const thresholdPercentage = globalConfig.globalThreshold;
    const thresholdValue = (inventory.allocation * thresholdPercentage) / 100;

    if (inventory.stockBalance - amount < thresholdValue) {
      console.log(`Stock level below the ${thresholdPercentage}% threshold for ${productId} in ${regionId}`);

      await this.kafkaService.sendMessage('inventory-decrease', {
        productId,
        regionId,
        currentStock: inventory.stockBalance - amount,
        threshold: thresholdPercentage,
        message: `Stock level has fallen below ${thresholdPercentage}% threshold.`,
      });
    }    

    try {
      inventory.decreaseStock(amount);
      await this.inventoryRepository.save(inventory);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  async setThreshold(thresholdPercentage: number): Promise<void> {
    if (thresholdPercentage < 0 || thresholdPercentage > 100) {
      throw new BadRequestException('Threshold percentage must be between 0 and 100.');
    }

    await this.globalConfigService.updateGlobalThreshold(thresholdPercentage);
  }
}