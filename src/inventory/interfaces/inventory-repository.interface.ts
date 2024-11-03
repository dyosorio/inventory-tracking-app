import { Inventory } from '@/entities/inventory.entity';

export interface InventoryRepositoryInterface {
    findOneByProductAndRegion(productId: string, regionId: string): Promise<Inventory | null>;
    save(inventory: Inventory): Promise<Inventory>;
    findAll(): Promise<Inventory[]>;
    clearAll(): Promise<void>;
    query?(queryString: string): Promise<void>;
    save(inventory: Inventory): Promise<Inventory>;
}
