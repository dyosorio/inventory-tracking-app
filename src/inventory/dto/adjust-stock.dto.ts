import { IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({ description: 'The unique ID of the product', example: 'product-uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'The unique ID of the region', example: 'region-uuid' })
  @IsUUID()
  regionId: string;

  @ApiProperty({ description: 'The amount to adjust the stock', example: 50 })
  @IsInt()
  @Min(1, { message: 'Amount must be greater than zero.' })
  amount: number;
}