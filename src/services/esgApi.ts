export interface ESGSummary {
  total_co2_kg: number;
  total_energy_kwh: number;
  avg_green_score: number;
  total_runs: number;
}

export interface ESGModelRow {
  model: string;
  co2_kg: number;
  energy_kwh: number;
  efficiency: number;
  runs: number;
}

export async function fetchESGSummary(): Promise<ESGSummary> {
  const res = await fetch("http://127.0.0.1:8000/api/esg/summary");
  if (!res.ok) throw new Error("Failed to fetch ESG summary");
  return res.json();
}

export async function fetchESGModels(): Promise<ESGModelRow[]> {
  const res = await fetch("http://127.0.0.1:8000/api/esg/models");
  if (!res.ok) throw new Error("Failed to fetch ESG models");
  return res.json();
}

export function downloadESGCSV() {
  window.open("http://127.0.0.1:8000/api/esg/download/csv", "_blank");
}

export function downloadESGPDF() {
  window.open("http://127.0.0.1:8000/api/esg/download/pdf", "_blank");
}
