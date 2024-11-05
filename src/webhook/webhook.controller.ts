import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProductService } from '@/product/product.service';
import { RegionService } from '@/region/region.service';
import { AlertPayloadDto } from './alert-payload.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly productService: ProductService,
    private readonly regionService: RegionService,
  ) {}

  @Post('receive-alert')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Receive notifications for inventory alerts',
    description: 'This endpoint receives alerts when an inventory stock balance falls below the configured threshold',
  })
  @ApiResponse({
    status: 200,
    description: 'Alert received successfully and processed.',
    schema: {
      example: {
        status: 'Webhook Alert received successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiBody({
    description: 'Payload containing the inventory alert details',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'product-uuid' },
        regionId: { type: 'string', example: 'region-uuid' },
        currentStock: { type: 'number', example: 15 },
        threshold: { type: 'number', example: 20 },
        message: { type: 'string', example: 'Stock level is below the threshold' },
      },
    },
  })
  async handleAlert(@Body() payload: AlertPayloadDto): Promise<{ status: string }> {
    const { productId, regionId } = payload;

    const productExists = await this.productService.findById(productId);
    const regionExists = await this.regionService.findById(regionId);

    if (!productExists) {
      throw new BadRequestException(`Product ID ${productId} does not exist.`);
    }

    if (!regionExists) {
      throw new BadRequestException(`Region ID ${regionId} does not exist.`);
    }    

    console.log('Received alert:', payload);
    return { status: 'Alert received successfully' };
  }
}