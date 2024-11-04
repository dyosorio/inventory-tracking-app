import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GlobalConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { default: 30 }) // Default threshold
  globalThreshold: number;
}