import { Injectable } from '@nestjs/common';
import { CreateParkingTransactionDto } from './dto/create-parking-transaction.dto.js';
import { UpdateParkingTransactionDto } from './dto/update-parking-transaction.dto.js';

@Injectable()
export class ParkingTransactionsService {
  create(createParkingTransactionDto: CreateParkingTransactionDto) {
    return 'This action adds a new parkingTransaction';
  }

  findAll() {
    return `This action returns all parkingTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingTransaction`;
  }

  update(id: number, updateParkingTransactionDto: UpdateParkingTransactionDto) {
    return `This action updates a #${id} parkingTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingTransaction`;
  }
}
