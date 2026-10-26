import { useEffect, useState } from "react";
import { api } from "../api";
import type { ParkingTransaction } from "../types";

interface Props {
  refreshKey: number;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ActiveVehicles({ refreshKey }: Props) {
  const [items, setItems] = useState<ParkingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ParkingTransaction[]>("/parking-transactions?status=ACTIVE")
      .then((data) => {
        setItems(data);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-3">
        Parked now ({items.length})
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

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
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100">
                <td className="py-2">#{tx.id}</td>
                <td className="py-2 font-mono">{tx.vehicle?.plateNumber}</td>
                <td className="py-2">{tx.vehicle?.vehicleType?.name}</td>
                <td className="py-2">{formatTime(tx.entryTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ActiveVehicles;
