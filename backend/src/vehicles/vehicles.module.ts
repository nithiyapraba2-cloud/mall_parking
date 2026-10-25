import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { VehiclesController } from './vehicles.controller.js';
import { Vehicle } from './entities/vehicle.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypesModule } from '../vehicle-types/vehicle-types.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), VehicleTypesModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
