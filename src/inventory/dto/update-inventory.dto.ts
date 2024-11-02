import { IsUUID, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class UpdateInventoryDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @IsInt()
  allocation: number;

  @IsDate()
  allocationTimestamp: Date;
}
