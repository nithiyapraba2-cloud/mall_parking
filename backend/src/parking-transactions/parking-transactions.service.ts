import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateParkingTransactionDto } from './dto/create-parking-transaction.dto.js';
import {
  ParkingTransaction,
  TransactionStatus,
} from './entities/parking-transaction.entity.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';

const PG_UNIQUE_VIOLATION = '23505';
const MS_PER_HOUR = 60 * 60 * 1000;

@Injectable()
export class ParkingTransactionsService {
  constructor(
    @InjectRepository(ParkingTransaction)
    private readonly transactionRepo: Repository<ParkingTransaction>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  // ---------- Check-in ----------
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
          entryTime: new Date(),
          status: TransactionStatus.ACTIVE,
        }),
      );
    } catch (err) {
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

    return this.findOne(saved.id);
  }

  // ---------- Check-out ----------
  async checkOut(id: number) {
    const transaction = await this.findOne(id);

    if (transaction.status !== TransactionStatus.ACTIVE) {
      throw new ConflictException(
        `Transaction ${id} is already ${transaction.status.toLowerCase()}`,
      );
    }

    const exitTime = new Date();
    const billableHours = this.calculateBillableHours(
      transaction.entryTime,
      exitTime,
    );
    const hourlyRate = transaction.vehicle.vehicleType.hourlyRate;
    const amount = Math.round(billableHours * hourlyRate * 100) / 100;

    // Only update if it is STILL active (protects against two clicks at once)
    const result = await this.transactionRepo.update(
      { id, status: TransactionStatus.ACTIVE },
      { exitTime, amount, status: TransactionStatus.COMPLETED },
    );
    if (result.affected === 0) {
      throw new ConflictException(`Transaction ${id} is already checked out`);
    }

    return {
      ...(await this.findOne(id)),
      billableHours,
      hourlyRate,
    };
  }
  findAll(status?: TransactionStatus) {
    return this.transactionRepo.find({
      where: status ? { status } : {},
      relations: { vehicle: { vehicleType: true } },
      order: { entryTime: 'DESC' },
      take: 100, // safety limit until we add real pagination
    });
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: { vehicle: { vehicleType: true } },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingTransaction`;
  }

  // ---------- helpers ----------

  // Round up to the next full hour, with a minimum of 1 hour
  private calculateBillableHours(entryTime: Date, exitTime: Date): number {
    const ms = exitTime.getTime() - entryTime.getTime();
    return Math.max(1, Math.ceil(ms / MS_PER_HOUR));
  }
}
