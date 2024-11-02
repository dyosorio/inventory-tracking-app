import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { ProductService } from "@/product/product.service";
import { RegionService } from "@/region/region.service";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const productService = app.get(ProductService);
    const regionService = app.get(RegionService);

    const regions = ['NA', 'EMEA', 'APAC'];
    for (const regionName of regions) {
        await regionService.addRegion({ name: regionName});
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

    for (const productData of products) {
        await productService.addProduct(productData);
    }

    console.log('Seeding completed');
    await app.close();
}

bootstrap();