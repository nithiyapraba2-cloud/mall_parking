import { useEffect, useState } from "react";
import { api } from "./api";
import type { VehicleType } from "./types";

function App() {
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<VehicleType[]>("/vehicle-types")
      .then(setTypes)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mall Parking</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-2">Vehicle types</h2>
      <ul className="space-y-2">
        {types.map((t) => (
          <li key={t.id} className="bg-white rounded-lg shadow p-3">
            {t.name}: ₹{t.hourlyRate} per hour
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
