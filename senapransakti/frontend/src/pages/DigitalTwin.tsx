import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Record = {
  heart_rate: number;
  spo2: number;
  temperature: number;
  created_at: string;
};

export default function DigitalTwin() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [soldier, setSoldier] = useState<any>(null);
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/digital-twin/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSoldier(data.soldier);
        setRecords(data.records);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-white">Loading Digital Twin...</p>;
  }

  return (
    <div className="text-white space-y-6">
      {/* Soldier Profile */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold">{soldier.name}</h2>
        <p className="text-gray-400">Unit: {soldier.unit}</p>
        <p className="text-gray-400">ID: {soldier.id}</p>
      </div>

      {/* Vitals Summary */}
      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-gray-400">Heart Rate</p>
            <p className="text-2xl font-bold">{records.at(-1)?.heart_rate}</p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-gray-400">SpO2</p>
            <p className="text-2xl font-bold">{records.at(-1)?.spo2}%</p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-gray-400">Temperature</p>
            <p className="text-2xl font-bold">{records.at(-1)?.temperature}°C</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Heart Rate" dataKey="heart_rate" data={records} />
        <ChartCard title="SpO2" dataKey="spo2" data={records} />
        <ChartCard title="Temperature" dataKey="temperature" data={records} />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: any[];
  dataKey: string;
}) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl h-64">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis hide />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
