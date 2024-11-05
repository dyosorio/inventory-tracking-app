import { IsUUID, IsNumber, IsString, Min } from 'class-validator';

export class AlertPayloadDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  regionId: string;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsNumber()
  @Min(0)
  threshold: number;

  @IsString()
  message: string;
}