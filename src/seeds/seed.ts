import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ProductService } from "@/product/product.service";
import { RegionService } from "@/region/region.service";
import { InventoryService } from "@/inventory/inventory.service";

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
        { name: 'CASHMERE BLEND STRIPED TURTLENECK SWEATER NATURAL', description: 'Luxuriously soft with classic stripes' },
        { name: 'BOUCLE JUMPER VANILLA', description: 'Effortlessly Chic!' },
        { name: 'TURTLENECK KNITS BRIGHT OCEAN', description: 'Vibrant warmth' },
        { name: 'BABYSOFT HIGH NECK SEAM RED', description: 'Silky comfort' },
        { name: 'BABYSOFT RIB MOCK NECK JUMPER MARINE', description: 'Naturally soft' },
        { name: 'TEXTURED BRETON STRIPE CARDIGAN BRETON STRIPE', description: 'Classic stripes with cozy texture' },
        { name: 'RIB CREW SWEATER TRAVERTINE', description: 'Romantic, cozy elegance' },
        { name: 'KIMBERLY OATMEAL', description: 'Wholesome comfort, soft like overnight oats' },
    ];

    const productEntities = [];
    for (const productData of products) {
        const product = await productService.addProduct(productData);
        productEntities.push(product);
    }

    for (const product of productEntities) {
        for (const region of regions) {
            await inventoryService.updateInventory({
                productId: product.id,
                regionId: region.id,
                allocation: Math.floor(Math.random() * 1000) + 1, 
                allocationTimestamp: new Date(),
            });
        }
    }

    console.log('Seeding completed');
    await app.close();
}

bootstrap();