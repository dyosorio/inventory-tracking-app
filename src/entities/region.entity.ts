import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
