import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({ description: 'The ID of the product'})
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'The ID of the region'})
  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({ description: 'The allocation quantity'})
  @IsInt()
  allocation: number;

  @ApiProperty({ description: 'The timestamp for the allocation' })
  @IsDate()
  allocationTimestamp: Date;
}
