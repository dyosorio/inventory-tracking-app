import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from 'src/entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async addRegion(regionData: Partial<Region>): Promise<Region> {
    const region = this.regionRepository.create(regionData);
    return this.regionRepository.save(region);
  }

  async getAllRegions(): Promise<Region[]> {
    return this.regionRepository.find();
  }
}
