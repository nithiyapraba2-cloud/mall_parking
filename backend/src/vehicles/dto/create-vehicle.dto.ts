import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateVehicleDto {
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[\s-]/g, '').toUpperCase()
      : value,
  )
  @IsString()
  @Matches(/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/, {
    message: 'Invalid plate number (example: TN09AB1234)',
  })
  plateNumber: string;

  @IsInt({ message: 'Vehicle type id must be a whole number' })
  @IsPositive()
  vehicleTypeId: number;

  @IsOptional()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone must be a 10-digit Indian mobile number',
  })
  ownerPhone?: string;
}
