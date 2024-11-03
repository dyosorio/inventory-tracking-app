import { IsNumber, Min, Max, IsUUID, IsPositive, IsOptional } from 'class-validator';

export class AdjustStockWithThresholdDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  regionId: string;

  @IsNumber()
  @IsPositive({ message: 'Amount must be greater than zero.' })
  @Min(1, { message: 'Amount must be at least 1.' })
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  thresholdPercentage?: number;
}