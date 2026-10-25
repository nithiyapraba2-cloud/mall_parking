import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service.js';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto.js';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto.js';

@Controller('vehicle-types')
export class VehicleTypesController {
  constructor(private readonly vehicleTypesService: VehicleTypesService) {}

  @Post()
  create(@Body() createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.vehicleTypesService.create(createVehicleTypeDto);
  }

  @Get()
  findAll() {
    return this.vehicleTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleTypeDto: UpdateVehicleTypeDto,
  ) {
    return this.vehicleTypesService.update(id, updateVehicleTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleTypesService.remove(id);
  }
}
