import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '@/entities/inventory.entity';
import { InventoryRepositoryInterface } from '../interfaces/inventory-repository.interface';

@Injectable()
export class InventoryRepository implements InventoryRepositoryInterface {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
    ) {}

    async findOneByProductAndRegion(productId: string, regionId: string): Promise<Inventory | null> {
        return this.inventoryRepository.findOne({
        where: {
            product: { id: productId },
            region: { id: regionId },
        },
        relations: ['product', 'region'],
        });
    }

    async save(inventory: Inventory): Promise<Inventory> {
        return this.inventoryRepository.save(inventory);
    }

    async findAll(): Promise<Inventory[]> {
        return this.inventoryRepository.find({ relations: ['product', 'region'] });
    }

    async clearAll(): Promise<void> {
        await this.inventoryRepository.query('TRUNCATE TABLE "inventory" RESTART IDENTITY CASCADE');
    }
}