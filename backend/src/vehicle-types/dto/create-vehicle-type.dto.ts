import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateVehicleTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50)
  name: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Hourly rate must be a number' },
  )
  @IsPositive({ message: 'Rate must be greater than 0' })
  hourlyRate: number;
}
