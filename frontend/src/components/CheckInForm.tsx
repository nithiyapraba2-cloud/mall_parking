import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api";
import type { ParkingTransaction, VehicleType } from "../types";

interface Props {
  types: VehicleType[];
  onCheckedIn: () => void; // NEW
}

function CheckInForm({ types, onCheckedIn }: Props) {
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const tx = await api<ParkingTransaction>("/parking-transactions", {
        method: "POST",
        body: JSON.stringify({
          plateNumber,
          vehicleTypeId: Number(vehicleTypeId),
        }),
      });
      const time = new Date(tx.entryTime).toLocaleTimeString("en-IN");
      setMessage(`Checked in. Ticket #${tx.id} at ${time}`);
      setPlateNumber("");
      setVehicleTypeId("");
      onCheckedIn(); // NEW: tell App to refresh the list
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 space-y-3"
    >
      <h2 className="text-xl font-semibold">Vehicle check-in</h2>

      <div>
        <label htmlFor="plate" className="block text-sm font-medium mb-1">
          Plate number
        </label>
        <input
          id="plate"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="TN 01 AB 1234"
          required
          maxLength={15}
          className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Vehicle type
        </label>
        <select
          id="type"
          value={vehicleTypeId}
          onChange={(e) => setVehicleTypeId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} (₹{t.hourlyRate}/hr)
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Checking in..." : "Check in"}
      </button>

      {message && <p className="text-green-700">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

export default CheckInForm;
