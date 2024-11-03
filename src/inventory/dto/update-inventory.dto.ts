import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsInt, IsNotEmpty, IsDate, Min } from 'class-validator';

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
  @IsInt({ message: 'Allocation must be an integer.' })
  @Min(0, { message: 'Allocation must be a non-negative number.' })
  allocation: number;

  @ApiProperty({ description: 'The timestamp for the allocation' })
  @Type(() => Date)
  @IsDate()
  allocationTimestamp: Date;
}
