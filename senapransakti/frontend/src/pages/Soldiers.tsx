import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Soldier = {
  id: number;
  name: string;
  unit: string;
};

export default function Soldiers() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  useEffect(() => {
    fetch("https://senapransakti.onrender.com/soldiers")
      .then((res) => res.json())
      .then(setSoldiers);
  }, []);

  // 🔍 Filtering logic
  const filtered = soldiers.filter((s) => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchUnit = unitFilter ? s.unit === unitFilter : true;
    return matchName && matchUnit;
  });

  // Extract unique units dynamically
  const units = Array.from(new Set(soldiers.map((s) => s.unit)));

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">👥 Soldiers</h1>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 p-2 rounded w-64"
        />

        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 p-2 rounded"
        >
          <option value="">All Units</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Profile</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-zinc-800">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.unit}</td>
                <td className="p-3">
                  <Link
                    to={`/soldiers/${s.id}`}
                    className="text-green-400 hover:underline"
                  >
                    View Digital Twin →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-4 text-gray-400">No soldiers found.</p>
        )}
      </div>
    </div>
  );
}
