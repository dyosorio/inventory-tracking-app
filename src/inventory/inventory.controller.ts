import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { Inventory } from '@/entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('update')
  @ApiOperation({ summary: 'Update inventory for a product in a region' })
  @ApiResponse({ status: 201, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async updateInventory(@Body() updateInventoryDto: UpdateInventoryDto) {
    await this.inventoryService.updateInventory(updateInventoryDto);
    return { status: 'Inventory updated successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory records' })
  @ApiResponse({ status: 200, description: 'Returns all inventory records', type: [Inventory] })
  async getAllInventory(): Promise<Inventory[]> {
    return this.inventoryService.getAllInventory();
  }
}
