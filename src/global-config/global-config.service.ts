import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalConfig } from '@/entities/global-config.entity';

@Injectable()
export class GlobalConfigService {
  constructor(
    @InjectRepository(GlobalConfig)
    private readonly globalConfigRepository: Repository<GlobalConfig>,
  ) {}

  async getConfig(): Promise<GlobalConfig> {
    let config = await this.globalConfigRepository.findOne({ where: {} });
    if (!config) {
      config = this.globalConfigRepository.create({ globalThreshold: 30 });
      await this.globalConfigRepository.save(config);
    }
    return config;
  }

  async setThreshold(newThreshold: number): Promise<GlobalConfig> {
    if (newThreshold < 0 || newThreshold > 100) {
        throw new Error('Threshold percentage must be between 0 and 100.');
    }
    let config = await this.getConfig();
    config.globalThreshold = newThreshold;
    return this.globalConfigRepository.save(config);
  }

  async updateGlobalThreshold(newThreshold: number): Promise<void> {
    await this.setThreshold(newThreshold);
  }
}

