import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { Vehicle } from './entities/vehicle.entity.js';
import { VehicleTypesService } from '../vehicle-types/vehicle-types.service.js';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly vehicleTypesService: VehicleTypesService,
  ) {}

  async create(dto: CreateVehicleDto) {
    await this.vehicleTypesService.findOne(dto.vehicleTypeId);
    await this.ensurePlateIsFree(dto.plateNumber);

    try {
      return await this.vehicleRepo.save(this.vehicleRepo.create(dto));
    } catch (err) {
      this.rethrowIfDuplicate(err, dto.plateNumber);
    }
  }

  findAll() {
    return this.vehicleRepo.find({
      relations: { vehicleType: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: { vehicleType: true },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${id} not found`);
    }
    return vehicle;
  }

  async update(id: number, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    if (dto.vehicleTypeId && dto.vehicleTypeId !== vehicle.vehicleTypeId) {
      await this.vehicleTypesService.findOne(dto.vehicleTypeId);
    }
    if (dto.plateNumber && dto.plateNumber !== vehicle.plateNumber) {
      await this.ensurePlateIsFree(dto.plateNumber);
    }

    try {
      await this.vehicleRepo.update(id, dto);
    } catch (err) {
      this.rethrowIfDuplicate(err, dto.plateNumber);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.vehicleRepo.delete(id);
    return { message: `Vehicle ${id} deleted` };
  }

  // ---------- helpers ----------

  private async ensurePlateIsFree(plateNumber: string) {
    const existing = await this.vehicleRepo.findOneBy({ plateNumber });
    if (existing) {
      throw new ConflictException(
        `Vehicle ${plateNumber} is already registered`,
      );
    }
  }

  private rethrowIfDuplicate(err: unknown, plateNumber?: string): never {
    if (
      err instanceof QueryFailedError &&
      (err.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
    ) {
      throw new ConflictException(
        `Vehicle ${plateNumber} is already registered`,
      );
    }
    throw err;
  }
}
