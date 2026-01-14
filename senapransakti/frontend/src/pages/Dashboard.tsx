import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await fetch("https://senapransakti.onrender.com/dashboard/summary");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch {
      setError("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAISummary = async () => {
    if (aiOpen) {
      setAiOpen(false);
      return;
    }

    setAiOpen(true);
    setAiSummary("Generating summary...");

    const res = await fetch("https://senapransakti.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Summarize dashboard health situation" })
    });

    const data = await res.json();
    setAiSummary(data.reply);
  };

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  if (!stats) {
    return (
      <div className="p-6 text-white space-y-4">
        <div className="h-8 bg-zinc-800 animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-zinc-900 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  const riskData = [
    { name: "High", value: stats.highRisk },
    { name: "Moderate", value: stats.moderateRisk },
    { name: "Low", value: stats.lowRisk },
  ];

  const volumeData = [
    { name: "Soldiers", value: stats.totalSoldiers },
    { name: "Records", value: stats.totalRecords },
    { name: "Alerts", value: stats.totalAlerts },
  ];

  // Temporary dynamic mock until backend provides endpoint
  const unitData = stats.unitBreakdown || [
    { unit: "Infantry", count: 10 },
    { unit: "Signals", count: 6 },
    { unit: "Artillery", count: 4 },
  ];

  const trendData = stats.trend || [
    { time: "10:00", high: 1 },
    { time: "11:00", high: 2 },
    { time: "12:00", high: 3 },
    { time: "13:00", high: 2 },
  ];

  return (
    <div className="space-y-8 text-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Command Dashboard</h1>

        <button
          onClick={loadAISummary}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          🧠 AI Summary
        </button>
      </div>

      {aiOpen && (
        <div className="bg-zinc-900 p-4 rounded border border-indigo-600 whitespace-pre-line">
          {aiSummary}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Total Soldiers" value={stats.totalSoldiers} />
        <Stat label="Total Records" value={stats.totalRecords} />
        <Stat label="High Risk" value={stats.highRisk} danger />
        <Stat label="Total Alerts" value={stats.totalAlerts} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartBox title="Risk Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskData} dataKey="value" label>
                <Cell fill="#ef4444" />
                <Cell fill="#facc15" />
                <Cell fill="#22c55e" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="System Volume">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartBox title="Unit Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={unitData}>
              <XAxis dataKey="unit" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="High Risk Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line dataKey="high" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </div>
  );
}

function Stat({ label, value, danger }: any) {
  return (
    <div className={`bg-zinc-900 p-4 rounded ${danger ? "text-red-500" : ""}`}>
      <p className="text-sm opacity-70">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function ChartBox({ title, children }: any) {
  return (
    <div className="bg-zinc-900 p-4 rounded">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
