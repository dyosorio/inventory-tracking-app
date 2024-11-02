import { Controller, Get, Post, Body } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "@/entities/product.entity";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('add')
    async addProduct(@Body() productData: Partial<Product>) {
        return this.productService.addProduct(productData);
    }

    @Get()
    async getAllProducts(): Promise<Product[]> {
        return this.productService.getAllProducts();
    }
}