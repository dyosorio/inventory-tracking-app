import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ProductService } from "@/product/product.service";
import { RegionService } from "@/region/region.service";
import { InventoryService } from "@/inventory/inventory.service";
import { Inventory } from "@/entities/inventory.entity";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const productService = app.get(ProductService);
    const regionService = app.get(RegionService);
    const inventoryService = app.get(InventoryService);

    const regionNames = ['NA', 'EMEA', 'APAC'];
    const regions = [];
    for (const regionName of regionNames) {
        let region = await regionService.findByName(regionName);
        if (!region) {
            region = await regionService.addRegion({ name: regionName });
        }
        regions.push(region); 
    }

    const products = [
        { name: 'VARSITY EMBROIDERED CARDIGAN RED', description: 'Bold, vintage-inspired charm' },
        { name: 'MEDWAY JUMPER MID BLUE', description: 'Timeless comfort with a modern twist' },
        { name: 'CASHMERE BLEND STRIPED TURTLENECK SWEATER NATURAL', description: 'Soft with classic stripes' },
    ];

    const productEntities = [];
    for (const productData of products) {
        const product = await productService.addProduct(productData);
        productEntities.push(product);
    }

    for (const product of productEntities) {
        for (const region of regions) {
            const allocation = Math.floor(Math.random() * 1000) + 1;
            await inventoryService.updateInventory({
                productId: product.id,
                regionId: region.id,
                allocation,
                allocationTimestamp: new Date(),
            });

            const newInventory: Inventory | null = await inventoryService.findOneByProductAndRegion(product.id, region.id);
            if (newInventory) {
                newInventory.stockBalance = newInventory.allocation;
                await inventoryService.save(newInventory); 
            }            
        }
    }

    console.log('Seeding completed');
    await app.close();
}

bootstrap();