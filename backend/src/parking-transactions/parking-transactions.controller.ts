import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingTransactionsService } from './parking-transactions.service.js';
import { CreateParkingTransactionDto } from './dto/create-parking-transaction.dto.js';
import { UpdateParkingTransactionDto } from './dto/update-parking-transaction.dto.js';

@Controller('parking-transactions')
export class ParkingTransactionsController {
  constructor(private readonly parkingTransactionsService: ParkingTransactionsService) {}

  @Post()
  create(@Body() createParkingTransactionDto: CreateParkingTransactionDto) {
    return this.parkingTransactionsService.create(createParkingTransactionDto);
  }

  @Get()
  findAll() {
    return this.parkingTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingTransactionDto: UpdateParkingTransactionDto) {
    return this.parkingTransactionsService.update(+id, updateParkingTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingTransactionsService.remove(+id);
  }
}
