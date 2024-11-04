import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GlobalConfigService } from './global-config.service';

@ApiTags('global-config')
@Controller('global-config')
export class GlobalConfigController {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @Post('set-threshold')
  @HttpCode(200)
  @ApiOperation({ summary: 'Set the global threshold for stock decrease notifications' })
  @ApiResponse({ status: 200, description: 'Global threshold set successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        globalThreshold: {
          type: 'number',
          description: 'The new global threshold percentage',
          example: 30,
        },
      },
    },
  })
  async setGlobalThreshold(@Body('globalThreshold') globalThreshold: number): Promise<{ status: string }> {
    await this.globalConfigService.setThreshold(globalThreshold);
    return { status: 'Global threshold set successfully' };
  }
}