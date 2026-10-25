import { Module } from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service.js';
import { VehicleTypesController } from './vehicle-types.controller.js';
import { VehicleType } from './entities/vehicle-type.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleType])],
  controllers: [VehicleTypesController],
  providers: [VehicleTypesService],
  exports: [VehicleTypesService],
})
export class VehicleTypesModule {}
