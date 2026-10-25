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
import { ParkingTransactionsService } from './parking-transactions.service.js';
import { CreateParkingTransactionDto } from './dto/create-parking-transaction.dto.js';

@Controller('parking-transactions')
export class ParkingTransactionsController {
  constructor(
    private readonly parkingTransactionsService: ParkingTransactionsService,
  ) {}

  // Check-in
  @Post()
  create(@Body() createParkingTransactionDto: CreateParkingTransactionDto) {
    return this.parkingTransactionsService.create(createParkingTransactionDto);
  }

  // Check-out
  @Patch(':id/checkout')
  checkOut(@Param('id', ParseIntPipe) id: number) {
    return this.parkingTransactionsService.checkOut(id);
  }

  @Get()
  findAll() {
    return this.parkingTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkingTransactionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkingTransactionsService.remove(id);
  }
}
