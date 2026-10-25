import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingTransactionsService } from './parking-transactions.service.js';
import { ParkingTransactionsController } from './parking-transactions.controller.js';
import { ParkingTransaction } from './entities/parking-transaction.entity.js';
import { VehiclesModule } from '../vehicles/vehicles.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingTransaction]), VehiclesModule],
  controllers: [ParkingTransactionsController],
  providers: [ParkingTransactionsService],
})
export class ParkingTransactionsModule {}
