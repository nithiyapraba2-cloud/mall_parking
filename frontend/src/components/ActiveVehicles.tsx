import { useEffect, useState } from "react";
import { api } from "../api";
import { formatTime } from "../format";
import type { CheckoutResult, ParkingTransaction } from "../types";
import ReceiptModal from "./ReceiptModal";

interface Props {
  refreshKey: number;
}

interface Receipt {
  tx: ParkingTransaction;
  result: CheckoutResult;
}

function ActiveVehicles({ refreshKey }: Props) {
  const [items, setItems] = useState<ParkingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    api<ParkingTransaction[]>("/parking-transactions?status=ACTIVE")
      .then((data) => {
        setItems(data);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleCheckout(tx: ParkingTransaction) {
    const plate = tx.vehicle?.plateNumber ?? `ticket #${tx.id}`;
    if (!window.confirm(`Check out ${plate}?`)) return;

    setCheckingOutId(tx.id);
    setError("");

    try {
      const result = await api<CheckoutResult>(
        `/parking-transactions/${tx.id}/checkout`,
        { method: "PATCH" },
      );
      setReceipt({ tx, result });
      setItems((prev) => prev.filter((item) => item.id !== tx.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCheckingOutId(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-3">
        Parked now ({items.length})
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No vehicles parked right now.</p>
      )}

      {items.length > 0 && (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-600">
              <th className="py-2">Ticket</th>
              <th className="py-2">Plate</th>
              <th className="py-2">Type</th>
              <th className="py-2">Entry time</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100">
                <td className="py-2">#{tx.id}</td>
                <td className="py-2 font-mono">{tx.vehicle?.plateNumber}</td>
                <td className="py-2">{tx.vehicle?.vehicleType?.name}</td>
                <td className="py-2">{formatTime(tx.entryTime)}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleCheckout(tx)}
                    disabled={checkingOutId === tx.id}
                    className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {checkingOutId === tx.id ? "Checking out..." : "Check out"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {receipt && (
        <ReceiptModal
          tx={receipt.tx}
          result={receipt.result}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}

export default ActiveVehicles;
