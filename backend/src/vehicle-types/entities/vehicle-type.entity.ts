import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
} from 'typeorm';

@Entity('vehicle_types')
@Check(`"hourlyRate" > 0`)
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  hourlyRate: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
