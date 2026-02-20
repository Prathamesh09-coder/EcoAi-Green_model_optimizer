export type DashboardMetrics = {
  co2_kg: number;
  energy_kwh: number;
  green_score: number;
};

export async function fetchDashboardMetrics() {
  const res = await fetch("http://127.0.0.1:8000/api/dashboard/metrics");
  if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
  return res.json();
}

// dashboardApi.ts

export async function fetchDashboardInsights() {
  const res = await fetch("http://127.0.0.1:8000/api/dashboard/insights");
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
}

export async function fetchDashboardTrends() {
  const res = await fetch("http://127.0.0.1:8000/api/dashboard/trends");
  if (!res.ok) throw new Error("Failed to fetch trends");
  return res.json();
}

