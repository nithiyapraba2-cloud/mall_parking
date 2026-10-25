import { Module } from '@nestjs/common';
import { ParkingTransactionsService } from './parking-transactions.service.js';
import { ParkingTransactionsController } from './parking-transactions.controller.js';
import { ParkingTransaction } from './entities/parking-transaction.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingTransaction])],
  controllers: [ParkingTransactionsController],
  providers: [ParkingTransactionsService],
})
export class ParkingTransactionsModule {}
