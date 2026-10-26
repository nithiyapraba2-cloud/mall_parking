import type { CheckoutResult, ParkingTransaction } from "../types";
import { formatMoney, formatTime } from "../format";

interface Props {
  tx: ParkingTransaction;
  result: CheckoutResult;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ReceiptModal({ tx, result, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Checked out</h2>

        <div className="space-y-2">
          <Row label="Ticket" value={`#${result.id}`} />
          <Row label="Plate" value={tx.vehicle?.plateNumber ?? "-"} />
          <Row label="Type" value={tx.vehicle?.vehicleType?.name ?? "-"} />
          <Row label="Entry" value={formatTime(result.entryTime)} />
          <Row
            label="Exit"
            value={result.exitTime ? formatTime(result.exitTime) : "-"}
          />
          <Row label="Billable hours" value={result.billableHours} />
          <Row label="Rate" value={`${formatMoney(result.hourlyRate)} / hr`} />
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>{formatMoney(result.amount)}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ReceiptModal;
