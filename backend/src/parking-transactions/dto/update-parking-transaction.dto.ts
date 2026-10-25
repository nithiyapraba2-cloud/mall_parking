import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingTransactionDto } from './create-parking-transaction.dto.js';

export class UpdateParkingTransactionDto extends PartialType(CreateParkingTransactionDto) {}
