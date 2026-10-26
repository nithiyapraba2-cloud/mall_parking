import { useEffect, useState } from "react";
import { api } from "./api";
import type { VehicleType } from "./types";
import CheckInForm from "./components/CheckInForm";

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

      <CheckInForm types={types} />
    </div>
  );
}

export default App;
