import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Region } from './region.entity';
@Entity()
@Unique(['product', 'region'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.inventories)
  product: Product;

  @ManyToOne(() => Region)
  region: Region;

  @Column('int')
  allocation: number;

  @Column({ type: 'timestamp' })
  allocationTimestamp: Date;
}
