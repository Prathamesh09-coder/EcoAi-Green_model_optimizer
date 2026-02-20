export type ModelCompareModel = {
  name: string;
  co2_kg: number;
  energy_kwh: number;
  gpu_hours: number;
  efficiency: number;
  usage: number;
};

export type ModelComparisonResponse = {
  models: ModelCompareModel[];
};

export async function fetchModelComparison(): Promise<ModelComparisonResponse> {
  const res = await fetch("http://127.0.0.1:8000/api/models/compare");
  if (!res.ok) throw new Error("Failed to fetch model comparison");
  return res.json();
}
