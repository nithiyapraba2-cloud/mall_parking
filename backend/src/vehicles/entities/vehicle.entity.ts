import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { VehicleType } from '../../vehicle-types/entities/vehicle-type.entity.js';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 15, unique: true })
  plateNumber: string;

  @Column()
  vehicleTypeId: number;

  @ManyToOne(() => VehicleType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleTypeId' })
  vehicleType: VehicleType;

  @CreateDateColumn()
  createdAt: Date;
}
