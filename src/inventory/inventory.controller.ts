import { Controller, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('update')
  async updateInventory(@Body() updateInventoryDto: UpdateInventoryDto) {
    await this.inventoryService.updateInventory(updateInventoryDto);
    return { status: 'Inventory updated successfully' };
  }
}
