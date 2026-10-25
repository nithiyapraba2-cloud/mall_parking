import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';

export enum TransactionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('parking_transactions')
@Index('one_active_parking_per_vehicle', ['vehicleId'], {
  unique: true,
  where: `"status" = 'ACTIVE'`,
})
export class ParkingTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  vehicleId: number;

  @ManyToOne(() => Vehicle, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Index()
  @Column({ type: 'timestamptz' })
  entryTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  exitTime: Date | null;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) =>
        value === null ? null : parseFloat(value),
    },
  })
  amount: number | null;

  @Index()
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.ACTIVE,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
