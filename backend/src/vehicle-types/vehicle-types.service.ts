import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto.js';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleType } from './entities/vehicle-type.entity.js';
import { QueryFailedError, Repository } from 'typeorm'; // ✅

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class VehicleTypesService {
  constructor(
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepo: Repository<VehicleType>,
  ) {}

  async create(dto: CreateVehicleTypeDto) {
    const existing = await this.vehicleTypeRepo.findOneBy({ name: dto.name });

    if (existing?.isActive) {
      throw new ConflictException(
        `Vehicle type with name "${dto.name}" already exists`,
      );
    }

    if (existing) {
      // soft-deleted row with the same name: bring it back instead of inserting a duplicate
      existing.isActive = true;
      existing.hourlyRate = dto.hourlyRate;
      return this.saveOrConflict(existing);
    }

    return this.saveOrConflict(this.vehicleTypeRepo.create(dto));
  }
  // findAll() {
  //   return this.vehicleTypeRepo.find({
  //     where: { isActive: true },
  //     order: { id: 'ASC' },
  //   });
  // }
  findAll(page = 1, limit = 10) {
    return this.vehicleTypeRepo.find({
      where: { isActive: true },
      order: { id: 'ASC' },
      skip: (page - 1) * limit, // how many rows to skip
      take: limit, // how many rows to return
    });
  }
  async findOne(id: number) {
    const vehicleType = await this.vehicleTypeRepo.findOneBy({
      id,
      isActive: true,
    });
    if (!vehicleType) {
      throw new NotFoundException(`Vehicle type ${id} not found`);
    }
    return vehicleType;
  }
  async update(id: number, dto: UpdateVehicleTypeDto) {
    const vehicleType = await this.findOne(id);

    if (dto.name && dto.name !== vehicleType.name) {
      const clash = await this.vehicleTypeRepo.findOneBy({ name: dto.name });
      if (clash) {
        throw new ConflictException(
          `Vehicle type "${dto.name}" already exists`,
        );
      }
    }

    this.vehicleTypeRepo.merge(vehicleType, dto);
    return this.saveOrConflict(vehicleType);
  }

  async remove(id: number) {
    const vehicleType = await this.findOne(id);
    vehicleType.isActive = false;
    await this.vehicleTypeRepo.save(vehicleType);
    return { message: `Vehicle type ${id} deleted` };
  }

  // the unique index on name is the final guard when two requests race past the checks above
  private async saveOrConflict(vehicleType: VehicleType) {
    try {
      return await this.vehicleTypeRepo.save(vehicleType);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `Vehicle type "${vehicleType.name}" already exists`,
        );
      }
      throw err;
    }
  }
}
