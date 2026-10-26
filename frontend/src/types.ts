export interface VehicleType {
  id: number;
  name: string;
  hourlyRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleTypeId: number;
  vehicleType?: VehicleType;
  createdAt: string;
}

export interface ParkingTransaction {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  entryTime: string;
  exitTime: string | null;
  amount: number | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface CheckoutResult extends ParkingTransaction {
  billableHours: number;
  hourlyRate: number;
}
