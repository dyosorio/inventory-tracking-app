import { Controller, Get, Post, Body } from "@nestjs/common";
import { RegionService } from "./region.service";
import { Region } from "@/entities/region.entity";

@Controller('regions')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}

    @Post('add')
    async addRegion(@Body() regionData: Partial<Region>) {
        return this.regionService.addRegion(regionData);
    }

    @Get()
    async getAllRegions(): Promise<Region[]> {
        return this.regionService.getAllRegions();
    }
}