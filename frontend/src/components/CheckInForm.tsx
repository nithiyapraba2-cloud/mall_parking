import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api";
import type { ParkingTransaction, VehicleType } from "../types";

interface Props {
  types: VehicleType[];
  onCheckedIn: () => void; // NEW
}
type Status = { type: "success" | "error"; text: string } | null;
const emptyForm = { plateNumber: "", vehicleTypeId: "" };
function CheckInForm({ types, onCheckedIn }: Props) {
  // const [plateNumber, setPlateNumber] = useState("");
  // const [vehicleTypeId, setVehicleTypeId] = useState("");
  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const tx = await api<ParkingTransaction>("/parking-transactions", {
        method: "POST",
        body: JSON.stringify({
          plateNumber: formData.plateNumber.trim().toUpperCase(),
          vehicleTypeId: Number(formData.vehicleTypeId),
        }),
      });
      const time = new Date(tx.entryTime).toLocaleTimeString("en-IN");
      setStatus({
        type: "success",
        text: `Checked in. Ticket #${tx.id} at ${time}`,
      });
      setFormData(emptyForm);
      onCheckedIn(); // NEW: tell App to refresh the list
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Check-in failed",
      });
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
          value={formData.plateNumber}
          onChange={(e) =>
            setFormData({ ...formData, plateNumber: e.target.value })
          }
          placeholder="TN 01 AB 1234"
          required
          disabled={loading}
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
          value={formData.vehicleTypeId}
          onChange={(e) => {
            setFormData({ ...formData, vehicleTypeId: e.target.value });
            setStatus(null);
          }}
          disabled={loading}
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
      {status && (
        <p
          className={
            status.type === "success" ? "text-green-700" : "text-red-600"
          }
        >
          {status.text}
        </p>
      )}
    </form>
  );
}

export default CheckInForm;
