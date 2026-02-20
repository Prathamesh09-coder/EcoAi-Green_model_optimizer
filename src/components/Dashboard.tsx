import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Leaf, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from './ui/progress';
import { fetchDashboardMetrics, fetchDashboardInsights, fetchDashboardTrends, DashboardMetrics } from '../services/dashboardApi';

interface EnergyTrend {
  label: string;
  energy: number;
}

interface Co2ByModel {
  model: string;
  co2: number;
}

interface MostUsedModel {
  name: string;
  usage: number;
  co2: number;
  efficiency: number;
}

interface DashboardInsights {
  energy_trend: EnergyTrend[];
  co2_by_model: Co2ByModel[];
  most_used_models: MostUsedModel[];
}

interface DashboardTrends {
  co2_change_pct: number | null;
  energy_change_pct: number | null;
  green_score_change_pct: number | null;
}



export default function Dashboard() {
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
const [insights, setInsights] = useState<DashboardInsights | null>(null);
const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [metricsData, insightsData, trendsData] = await Promise.all([
        fetchDashboardMetrics(),
        fetchDashboardInsights(),
        fetchDashboardTrends(),
      ]);
      setMetrics(metricsData);
      setInsights(insightsData);
      setTrends(trendsData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

const greenScore = Math.min(metrics?.green_score ?? 0, 100);  

const scaleCO2 = (kg: number) => {
  if (kg === 0) return "0 kg";
  if (kg < 0.001) return `${(kg * 1_000_000).toFixed(2)} mg`;
  if (kg < 1) return `${(kg * 1000).toFixed(2)} g`;
  return `${kg.toFixed(2)} kg`;
};

const scaleEnergy = (kwh: number) => {
  if (kwh === 0) return "0 kWh";
  if (kwh < 0.001) return `${(kwh * 1_000_000).toFixed(2)} mWh`;
  if (kwh < 1) return `${(kwh * 1000).toFixed(2)} Wh`;
  return `${kwh.toFixed(2)} kWh`;
};




  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Monitor your AI models' environmental impact</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-gradient-to-br from-rose-50 to-rose-100/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-700">Total CO₂ Emissions</CardTitle>
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Activity className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-900">{scaleCO2(metrics?.co2_kg || 0)}</span>
                <span className="text-gray-500">(CO₂)</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-emerald-600">
                <TrendingUp
  className={`h-4 w-4 ${
    (trends?.co2_change_pct ?? 0) > 0 ? "rotate-180" : ""
  }`}
/>
                <span>{trends?.co2_change_pct ? `${trends.co2_change_pct}% reduction` : 'No data'}</span>
              </div>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights?.energy_trend?.slice(-4) || []}>
                  <Line type="monotone" dataKey="energy" stroke="#f43f5e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-amber-100 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-gradient-to-br from-amber-50 to-amber-100/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-700">Energy Consumption</CardTitle>
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-900">{scaleEnergy(metrics?.energy_kwh || 0)}</span>
                <span className="text-gray-500">(Energy Consumption)</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-emerald-600">
                <TrendingUp
  className={`h-4 w-4 ${
    (trends?.energy_change_pct ?? 0) > 0 ? "rotate-180" : ""
  }`}
/>
                <span>{trends?.energy_change_pct ? `${trends.energy_change_pct}% decrease` : 'No data'}</span>
              </div>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights?.energy_trend?.slice(-4) || [] }>
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-100/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-700">Green AI Score</CardTitle>
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Leaf className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-900">{metrics?.green_score?.toFixed(1) || 0}</span>
                <span className="text-gray-500">/ 100</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-emerald-600">
                <TrendingUp
  className={`h-4 w-4 ${
    (trends?.green_score_change_pct ?? 0) > 0 ? "rotate-180" : ""
  }`}
/>
                <span>{trends?.green_score_change_pct ? `${trends.green_score_change_pct}% improvement` : 'No data'}</span>
              </div>
            </div>
            <div className="relative h-12 w-12">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${greenScore}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Energy Usage Over Time</CardTitle>
            <p className="text-gray-500">Monthly energy consumption in kWh</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insights?.energy_trend || []}>
                <defs>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#energyGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">CO₂ Emissions Across Models</CardTitle>
            <p className="text-gray-500">Carbon footprint by AI model (kg CO₂)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights?.co2_by_model || []}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="model" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="co2" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Used Models */}
                 {/* Most Used Models */}
<Card className="shadow-sm">
  <CardHeader>
    <CardTitle className="text-gray-800">Most Used Models</CardTitle>
    <p className="text-gray-500">Your frequently utilized AI models</p>
  </CardHeader>

  <CardContent>
    <div className="grid gap-4 md:grid-cols-3">
      {(insights?.most_used_models || []).map((model: MostUsedModel) => {
        // ---- CO₂ scaling logic ----
        const co2Kg = model.co2 ?? 0;
        const isTiny = co2Kg > 0 && co2Kg < 0.01;
        const displayCo2 = isTiny
          ? `${(co2Kg * 1000).toFixed(2)} g`
          : `${co2Kg.toFixed(8)} kg`;

        return (
          <div
            key={model.name}
            className="group relative overflow-hidden rounded-xl border border-gray-200
                       bg-gradient-to-br from-white to-gray-50 p-6 transition-all hover:shadow-lg"
          >
            {/* Efficiency badge */}
            <div className="absolute right-4 top-4">
              <div className="rounded-full bg-emerald-100 px-3 py-1">
                <span className="text-emerald-700">
                  {model.efficiency.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Model header */}
            <div className="mb-4">
              <h4 className="text-gray-900">{model.name}</h4>
              <p className="text-gray-500">Model Instance</p>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Usage Count</span>
                <span className="text-gray-900">
                  {model.usage.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">CO₂ Emission</span>
                <span className="text-gray-900">{displayCo2}</span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Efficiency</span>
                </div>
                <Progress
                  value={Math.min(model.efficiency, 100)}
                  className="h-2 bg-gray-200"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card> 
    </div>
  );
}
