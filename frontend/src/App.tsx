import { useEffect, useState } from "react";
import { api } from "./api";
import type { VehicleType } from "./types";
import CheckInForm from "./components/CheckInForm";
import ActiveVehicles from "./components/ActiveVehicles";

function App() {
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api<VehicleType[]>("/vehicle-types")
      .then(setTypes)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mall Parking</h1>

      {error && <p className="text-red-600">{error}</p>}

      <CheckInForm
        types={types}
        onCheckedIn={() => setRefreshKey((k) => k + 1)}
      />

      <ActiveVehicles refreshKey={refreshKey} />
    </div>
  );
}

export default App;

// CheckInForm ──onCheckedIn()──▶ App: setRefreshKey(k + 1)
//                                  │
//                                  ▼ refreshKey changes 0 → 1
//                            ActiveVehicles: useEffect runs → reloads list
