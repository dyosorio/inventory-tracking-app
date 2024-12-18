import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findById(productId: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id: productId } });
  }

  async addProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async clearAllProducts(): Promise<void> {
    await this.productRepository.query('TRUNCATE TABLE "product" RESTART IDENTITY CASCADE');
  }
}
