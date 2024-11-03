import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Region } from './region.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['product', 'region'])
export class Inventory {
  @ApiProperty({ description: 'The unique ID of the inventory record' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The associated product' })
  @ManyToOne(() => Product, (product) => product.inventories, { eager: true })
  product: Product;

  @ApiProperty({ description: 'The associated region' })
  @ManyToOne(() => Region, { eager: true })
  region: Region;

  @ApiProperty({ description: 'The allocation quantity', example: 500 })
  @Column('int', { default: 0 })
  allocation: number;

  @ApiProperty({ description: 'The timestamp for the allocation' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  allocationTimestamp: Date;

  @ApiProperty({ description: 'The total stock available', example: 1000 })
  @Column('int', { default: 0 })
  stockBalance: number;

  /**
   * Increases the stock allocation by the specified amount.
   * @param amount The amount to increase.
   * @throws Error if the amount is invalid.
   */
  increaseStock(amount: number): void {
    if (amount <= 0) {
      throw new Error('Increase amount must be greater than zero.');
    }
    this.allocation += amount;
    this.allocationTimestamp = new Date();
  }

  /**
   * Decreases the stock allocation by the specified amount.
   * @param amount The amount to decrease.
   * @throws Error if the resulting allocation is negative or the amount is invalid.
   */
  decreaseStock(amount: number): boolean {
    if (amount <= 0) {
      throw new Error('Decrease amount must be greater than zero.');
    }
    if (this.allocation - amount < 0) {
      throw new Error('Stock cannot be negative.');
    }
    this.allocation -= amount;
    this.allocationTimestamp = new Date();
    return true;
  }

  /**
   * Checks if the current allocation meets or exceeds a given threshold.
   * @param threshold The threshold value to compare against the current allocation.
   * @returns `true` if the allocation meets or exceeds the threshold, `false` otherwise.
   */
  meetsThreshold(threshold: number): boolean {
    return this.allocation >= threshold;
  }

  /**
   * Updates the allocation and the allocation timestamp.
   * @param newAllocation The new allocation value to set.
   */
  updateAllocation(newAllocation: number): void {
    if (newAllocation < 0) {
      throw new Error('Allocation must be a non-negative number.');
    }
    this.allocation = newAllocation;
    this.allocationTimestamp = new Date(); 
  }  
}
