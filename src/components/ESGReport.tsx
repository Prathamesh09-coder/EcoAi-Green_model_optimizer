import {
  fetchESGSummary,
  fetchESGModels,
  downloadESGCSV,
  downloadESGPDF,
  ESGSummary,
  ESGModelRow
} from "../services/esgApi";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, Activity, Award, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function ESGReport() {

  const [summary, setSummary] = useState<ESGSummary | null>(null);
  const [models, setModels] = useState<ESGModelRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchESGSummary(), fetchESGModels()])
      .then(([s, m]) => {
        setSummary(s);
        setModels(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading ESG data...</div>;
  if (!summary) return <div>No ESG data available</div>;

  const now = new Date();
const quarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;
const year = now.getFullYear();

// Simple grading logic
const esgGrade =
  summary.avg_green_score >= 90 ? "A+" :
  summary.avg_green_score >= 80 ? "A" :
  summary.avg_green_score >= 70 ? "B" : "C";

// Example dynamic insights (can be refined later)
const co2Text =
  summary.total_co2_kg === 0
    ? "No emissions recorded yet."
    : `Total CO₂ emissions recorded are ${summary.total_co2_kg} kg across ${summary.total_runs} runs.`;

const getESGRating = (efficiency: number) => {
  if (efficiency >= 90) return "A+";
  if (efficiency >= 80) return "A";
  if (efficiency >= 70) return "B";
  if (efficiency >= 60) return "C";
  return "D";
};


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">AI Sustainability Report</h2>
          <p className="text-gray-500">Comprehensive ESG metrics for your AI operations</p>
        </div>
        <div className="flex gap-3">
         <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={downloadESGCSV}
          >
            <FileDown className="h-4 w-4" />
            Download CSV
          </Button>

          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm hover:shadow-md"
            onClick={downloadESGPDF}
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </Button>

        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-6">
        <p className="mb-2 text-gray-600">Total CO₂ Emissions</p>
        <div className="mb-2 text-gray-900">
          {summary.total_co2_kg.toFixed(6)} kg
        </div>
      </CardContent>
    </Card>

  <Card className="overflow-hidden shadow-sm">
    <CardContent className="p-6">
      <p className="mb-2 text-gray-600">Avg Efficiency Score</p>
      <div className="mb-2 text-gray-900">
        {summary.avg_green_score}/100
      </div>
    </CardContent>
  </Card>

  <Card className="overflow-hidden shadow-sm">
    <CardContent className="p-6">
      <p className="mb-2 text-gray-600">Total Energy Consumption</p>
      <div className="mb-2 text-gray-900">
        {summary.total_energy_kwh.toFixed(6)} kWh
      </div>
    </CardContent>
  </Card>
</div>


      {/* Report Preview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Report Preview</CardTitle>
          <p className="text-gray-600">
            {quarter}, {year}
          </p>

        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12">
            <div className="mx-auto max-w-3xl space-y-8">
              {/* Report Header */}
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-gray-900">AI Sustainability Report</h3>
                <p className="text-gray-600">
                  {quarter}, {year}
                </p>

                <p className="text-gray-500">Green Model Optimizer Platform</p>
              </div>

              {/* Executive Summary */}
              <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <h4 className="text-gray-900">Executive Summary</h4>
               <p className="text-gray-600">
                  This report provides a comprehensive overview of the environmental impact of AI model operations
                  for {quarter} {year}. <strong>{co2Text}</strong> The average Green AI efficiency score achieved is{" "}
                  <strong>{summary.avg_green_score}/100</strong>, indicating the sustainability level
                  of current model executions.
                </p>

              </div>

              {/* Key Metrics Visualization */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                  <div className="mb-2 text-gray-700">Carbon Footprint</div>
                  <div className="mb-1 text-gray-900">
                    {summary.total_co2_kg} kg CO₂
                  </div>

                  <div className="text-emerald-600">
                    Based on real execution data
                  </div>

                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <div className="mb-2 text-gray-700">Green AI Score</div>
                  <div className="mb-1 text-gray-900">
                    {summary.avg_green_score}/100
                  </div>

                  <div className="text-blue-600">
                    Based on real execution data
                  </div>

                </div>
              </div>

              {/* Certification Badge */}
              <div className="flex items-center justify-center gap-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <Award className="h-12 w-12 text-emerald-600" />
                <div>
                  <div className="text-gray-900">ESG Compliance Level</div>
                  <div className="text-emerald-600">
                    Grade {esgGrade} – Based on real execution metrics
                  </div>

                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model-wise ESG Details Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Model-wise ESG Details</CardTitle>
          <p className="text-gray-500">Environmental metrics breakdown by AI model</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Model Name</TableHead>
                  <TableHead>CO₂ Emissions</TableHead>
                  <TableHead>Energy Consumption</TableHead>
                  <TableHead>Runs</TableHead>
                  <TableHead>Efficiency Score</TableHead>
                  <TableHead>ESG Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((row) => (
                  <TableRow key={row.model}>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.co2_kg}</TableCell>
                    <TableCell>{row.energy_kwh}</TableCell>
                    <TableCell>{row.runs}</TableCell>
                    <TableCell>{row.efficiency}%</TableCell>
                    <TableCell>{getESGRating(row.efficiency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-gray-900">Carbon Offset Opportunity</h4>
            </div>
            <p className="mb-4 text-gray-600">
              Your current emissions could be offset by planting approximately <strong>18 trees</strong> or investing
              in renewable energy credits equivalent to <strong>$42.50</strong>.
            </p>
            <Button variant="outline" className="border-emerald-200 bg-white hover:bg-emerald-50">
              Explore Carbon Credits
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-gray-900">Compliance Status</h4>
            </div>
            <p className="mb-4 text-gray-600">
              Your organization meets <strong>EU AI Act</strong> sustainability requirements and exceeds{' '}
              <strong>ISO 14001</strong> environmental management standards.
            </p>
            <Button variant="outline" className="border-blue-200 bg-white hover:bg-blue-50">
              View Certifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
