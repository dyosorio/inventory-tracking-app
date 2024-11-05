import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ProductModule } from '@/product/product.module'; 
import { RegionModule } from '@/region/region.module'; 

@Module({
    imports: [
        ProductModule, 
        RegionModule
    ],
    controllers: [WebhookController],
})
export class WebhookModule {}