import { Controller, Get, Post, Patch, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { Inventory } from '@/entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto'; 
import { AdjustStockWithThresholdDto } from './dto/adjust-stock-with-threshold.dto'; 

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update inventory for a product in a region' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async updateInventory(@Body() updateInventoryDto: UpdateInventoryDto): Promise<{ status: string }> {
    await this.inventoryService.updateInventory(updateInventoryDto);
    return { status: 'Inventory updated successfully' };
  }

  @Patch('increase')
  @HttpCode(200)
  @ApiOperation({ summary: 'Increase inventory allocation for a product in a region' })
  @ApiResponse({ status: 200, description: 'Inventory increased successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: AdjustStockDto, examples: { default: { value: { productId: 'product-uuid', regionId: 'region-uuid', amount: 20 } } } })
  async increaseInventory(@Body() adjustStockDto: AdjustStockDto): Promise<{ status: string }> {
    await this.inventoryService.increaseStock(adjustStockDto);
    return { status: 'Inventory increased successfully' };
  }

  @Patch('decrease')
  @HttpCode(200)
  @ApiOperation({ summary: 'Decrease inventory allocation for a product in a region' })
  @ApiResponse({ status: 200, description: 'Inventory decreased successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: AdjustStockWithThresholdDto, examples: { default: { value: { productId: 'product-uuid', regionId: 'region-uuid', amount: 20, thresholdPercentage: 30 } } } })
  async decreaseInventory(@Body() adjustStockWithThresholdDto: AdjustStockWithThresholdDto): Promise<{ status: string }> {
    await this.inventoryService.decreaseStock(adjustStockWithThresholdDto);
    return { status: 'Inventory decreased successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory records' })
  @ApiResponse({ status: 200, description: 'Returns all inventory records', type: [Inventory] })
  async getAllInventory(): Promise<Inventory[]> {
    return this.inventoryService.getAllInventory();
  }

  @Post('set-threshold')
  @HttpCode(200)
  @ApiOperation({ summary: 'Set the threshold for stock decrease notifications' })
  @ApiResponse({ status: 200, description: 'Threshold set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        thresholdPercentage: {
          type: 'number',
          description: 'Threshold percentage for stock decrease notifications',
          example: 30,
        },
      },
    },
  })  
  async setThreshold(@Body() adjustStockWithThresholdDto: AdjustStockWithThresholdDto): Promise<{ status: string }> {
    await this.inventoryService.setThreshold(adjustStockWithThresholdDto.thresholdPercentage);
    return { status: 'Threshold set successfully' };
  }  
}
