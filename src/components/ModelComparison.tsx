import { useEffect, useState } from "react";
import { fetchModelComparison, ModelComparisonResponse } from "../services/modelCompareApi";



import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Award, Zap, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const SCALE = {
  co2 : 1000,
  energy : 1000,
};


export default function ModelComparison() {
  // 1️⃣ State
const [apiData, setApiData] = useState<ModelComparisonResponse | null>(null);
const [loading, setLoading] = useState(true);
const [selectedModels, setSelectedModels] = useState<string[]>([]);

// 2️⃣ Fetch backend data
useEffect(() => {
  fetchModelComparison()
    .then((res) => {
      setApiData(res);
      setSelectedModels(res.models.slice(0, 3).map(m => m.name));
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, []);

// 3️⃣ Guards (STOP rendering early)
if (loading) return <div>Loading model comparison...</div>;
if (!apiData) return <div>No data available</div>;

// 4️⃣ Build backend-driven data FIRST
const modelData: Record<string, any> = {};
const availableModels: string[] = [];

apiData.models.forEach((model) => {
  availableModels.push(model.name);
  modelData[model.name] = {
    co2: model.co2_kg,
    energy: model.energy_kwh,
    gpuHours: model.usage,
    score: model.efficiency,
  };
});

// 5️⃣ NOW it is SAFE to use modelData
const comparisonData = [
  {
    metric: 'CO₂ (g)',
    ...Object.fromEntries(
      selectedModels.map(model => [model, modelData[model].co2*SCALE.co2])
    ),
  },
  {
    metric: 'Energy (Scaled kWh * 1k)',
    ...Object.fromEntries(
      selectedModels.map(model => [model, modelData[model].energy*SCALE.energy])
    ),
  },
  {
    metric: 'GPU Hours',
    ...Object.fromEntries(
      selectedModels.map(model => [model, modelData[model].gpuHours])
    ),
  },
];

const colors = selectedModels.map(
  (_, i) => `hsl(${160 + i * 30}, 70%, 45%)`
);


const bestModel =
  selectedModels.length > 0
    ? selectedModels.reduce(
        (best, model) =>
          modelData[model].score > modelData[best].score ? model : best,
        selectedModels[0]
      )
    : null;





  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-gray-900">Compare AI Models</h2>
        <p className="text-gray-500">Analyze environmental impact across different models</p>
      </div>

      {/* Model Selection */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Select Models to Compare</CardTitle>
          <p className="text-gray-500">Choose 2-3 models for side-by-side comparison</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Select
                key={index}
                value={selectedModels[index] || ''}
                onValueChange={(value) => {
                  const newModels = [...selectedModels];
                  newModels[index] = value;
                  setSelectedModels(newModels.filter(Boolean));
                }}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={`Select Model ${index + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model} disabled={selectedModels.includes(model) && selectedModels[index] !== model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {selectedModels.map((model, index) => {
          const data = modelData[model];
          const isBest = model === bestModel;
          
          return (
            <Card
              key={model}
              className={`relative overflow-hidden shadow-sm transition-all hover:shadow-md ${
                isBest ? 'border-2 border-emerald-400' : ''
              }`}
            >
              {isBest && (
                <div className="absolute right-0 top-0">
                  <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-3 py-1.5 text-white shadow-lg">
                    <Award className="h-4 w-4" />
                    <span>Best</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="bg-gradient-to-br from-gray-50 to-white pb-4">
                <CardTitle className="text-gray-800">{model}</CardTitle>
                <p className="text-gray-500">Performance Metrics</p>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-rose-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-2 shadow-sm">
                        <Activity className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">
                          CO₂ Emitted ({data.co2 < 1 ? "Low impact" : "High impact"})
                        </p>

                        <p className="text-gray-900">{data.co2} kg</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-2 shadow-sm">
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">Energy Used</p>
                        <p className="text-gray-900">{data.energy} kWh</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-2 shadow-sm">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">GPU Hours</p>
                        <p className="text-gray-900">{data.gpuHours} hrs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600">Eco-Efficiency Score</span>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600">
                      {data.score}/100
                    </Badge>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Side-by-Side Comparison</CardTitle>
          <p className="text-gray-500">Visual comparison of key environmental metrics</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
  contentStyle={{
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  }}
  formatter={(value, name, props) => {
    const metric = props.payload.metric;

    if (metric.includes("CO₂")) {
      return [`${(value as number).toFixed(3)} g (scaled)`, name];
    }

    if (metric.includes("Energy")) {
      return [`${(value as number).toFixed(3)} kWh (scaled)`, name];
    }

    return [value, name];
  }}
/>
              <Legend />
              {selectedModels.map((model, index) => (
                <Bar
                  key={model}
                  dataKey={model}
                  fill={colors[index]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-900">Key Insight</h4>
              <p className="text-gray-600">
                <strong className="text-emerald-700">{bestModel}</strong> is the most eco-efficient model with a score of{' '}
                <strong>{modelData[bestModel].score}/100</strong>. It produces{' '}
                <strong>{modelData[bestModel].co2}kg CO₂</strong> and consumes{' '}
                <strong>{modelData[bestModel].energy}kWh</strong> of energy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
