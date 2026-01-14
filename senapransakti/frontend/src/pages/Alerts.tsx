import { useEffect, useState } from "react";

type Alert = {
  id: number;
  soldierId: number;
  message: string;
  risk: string;
  createdAt?: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(() => setError("Failed to load alerts"));
  }, []);

  function riskColor(risk: string) {
    if (risk === "HIGH") return "text-red-500";
    if (risk === "MODERATE") return "text-yellow-400";
    return "text-green-400";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-zinc-900 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Soldier ID</th>
              <th className="p-4">Message</th>
              <th className="p-4">Risk</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id} className="border-t border-zinc-800 hover:bg-zinc-800">
                <td className="p-4">{a.id}</td>
                <td className="p-4">{a.soldierId}</td>
                <td className="p-4">{a.message}</td>
                <td className={`p-4 font-bold ${riskColor(a.risk)}`}>
                  {a.risk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
