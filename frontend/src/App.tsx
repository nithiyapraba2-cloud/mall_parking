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
    <div className="container">
      <h1>Mall Parking</h1>

      {error && <p className="error">{error}</p>}

      <h2>Vehicle types</h2>
      <ul>
        {types.map((t) => (
          <li key={t.id}>
            {t.name}: ₹{t.hourlyRate} per hour
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
