import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateParkingTransactionDto } from './dto/create-parking-transaction.dto.js';
import { UpdateParkingTransactionDto } from './dto/update-parking-transaction.dto.js';
import {
  ParkingTransaction,
  TransactionStatus,
} from './entities/parking-transaction.entity.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class ParkingTransactionsService {
  constructor(
    @InjectRepository(ParkingTransaction)
    private readonly transactionRepo: Repository<ParkingTransaction>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  // Check-in
  async create(dto: CreateParkingTransactionDto) {
    const vehicle = await this.vehiclesService.findOrCreate(dto);

    const alreadyParked = await this.transactionRepo.findOneBy({
      vehicleId: vehicle.id,
      status: TransactionStatus.ACTIVE,
    });
    if (alreadyParked) {
      throw new ConflictException(
        `Vehicle ${vehicle.plateNumber} is already parked`,
      );
    }

    let saved: ParkingTransaction;
    try {
      saved = await this.transactionRepo.save(
        this.transactionRepo.create({
          vehicleId: vehicle.id,
          entryTime: new Date(), // the server's clock, never the user's
          status: TransactionStatus.ACTIVE,
        }),
      );
    } catch (err) {
      // Safety net: the one_active_parking_per_vehicle index
      if (
        err instanceof QueryFailedError &&
        (err.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `Vehicle ${vehicle.plateNumber} is already parked`,
        );
      }
      throw err;
    }

    return this.transactionRepo.findOne({
      where: { id: saved.id },
      relations: { vehicle: { vehicleType: true } },
    });
  }

  findAll() {
    return `This action returns all parkingTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingTransaction`;
  }

  update(id: number, dto: UpdateParkingTransactionDto) {
    return `This action updates a #${id} parkingTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingTransaction`;
  }
}
