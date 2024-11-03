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
  @ManyToOne(() => Product, (product) => product.inventories)
  product: Product;

  @ApiProperty({ description: 'The associated region' })
  @ManyToOne(() => Region)
  region: Region;

  @ApiProperty({ description: 'The allocation quantity' })
  @Column('int')
  allocation: number;

  @ApiProperty({ description: 'The timestamp for the allocation' })
  @Column({ type: 'timestamp' })
  allocationTimestamp: Date;
}
