export interface VehicleType {
  id: number;
  name: string;
  hourlyRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface ParkingTransaction {
  id: number;
  vehicleId: number;
  entryTime: string;
  exitTime: string | null;
  amount: number | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}
