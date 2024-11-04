import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  @Post('receive-alert')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Receive notifications for inventory alerts',
    description: 'This endpoint receives alerts when an inventory stock balance falls below the configured threshold. It simulates processing the alert and returns a status response.',
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
  handleAlert(@Body() payload: any): { status: string } {
    if (!payload.productId || !payload.regionId) {
        throw new BadRequestException('Product ID and Region ID are required.');
    }
    console.log('Received alert:', payload);
    return { status: 'Webhook Alert received successfully' };
  }
}