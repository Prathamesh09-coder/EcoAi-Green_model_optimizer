import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Layers, Gauge, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

import { useEffect, useState } from "react";
import { fetchRecommendations } from "../services/recommendationsApi";



const additionalTips = [
  {
    title: 'Batch Your Requests',
    description: 'Group API calls together to reduce overhead',
    impact: 'Low',
  },
  {
    title: 'Cache Frequent Results',
    description: 'Store and reuse common model outputs',
    impact: 'Medium',
  },
  {
    title: 'Schedule During Off-Peak',
    description: 'Run heavy workloads when renewable energy is abundant',
    impact: 'Medium',
  },
];

export default function Recommendations() {

  const [recommendations, setRecommendations] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

const [applied, setApplied] = useState<number[]>([]);
const [selectedRec, setSelectedRec] = useState<any | null>(null);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchRecommendations();
    setRecommendations(data);
    setLoading(false);
  };

  loadData();
}, []);

if (loading) {
  return <div className="text-center mt-10">Generating AI recommendations...</div>;
}

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-gray-900">Eco Optimization Suggestions</h2>
        <p className="text-gray-500">Actionable recommendations to reduce your environmental impact</p>
      </div>

      {/* Total Impact Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white p-4 shadow-lg">
                <TrendingDown className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Potential Monthly Savings</h3>
                <p className="text-gray-600">By implementing all recommendations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900">173 kg CO₂</div>
              <div className="text-emerald-600">~48% reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      

      {/* Main Recommendations */}
      <div className="space-y-6">

        
        {recommendations.map((rec, index) => {
          
          return (

            
            <Card
              key={index}
              className="group overflow-hidden shadow-sm transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Icon and Badge */}
                  <div className="relative flex-shrink-0">
                    <div className={`rounded-2xl bg-gradient-to-br ${rec.impactColor} p-4 shadow-lg`}>
                      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg">
  <CheckCircle2 className="h-8 w-8 text-white" />
</div>
                    </div>
                    <Badge
  className={`absolute -bottom-2 -right-2 px-3 py-1 font-medium shadow-sm
  ${
    rec.impact === "High"
      ? "bg-rose-100 text-rose-700"
      : rec.impact === "Medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700"
  }`}
>
  {rec.impact}
</Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="mb-2 text-gray-900">{rec.title}</h3>
                      <p className="text-gray-600">{rec.description}</p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-6">
                      <div className="rounded-xl bg-emerald-50 px-4 py-2">
                        <span className="text-gray-600">Potential Savings: </span>
                        <span className="text-emerald-700">
  {Number(rec.co2_saving_kg).toFixed(2)} kg CO₂/month
</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                     <Button
  onClick={() => setApplied([...applied, index])}
  disabled={applied.includes(index)}
  className={`shadow-sm hover:shadow-md ${
    applied.includes(index)
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-emerald-500 to-teal-600"
  }`}
>
  {applied.includes(index) ? "Applied ✓" : "Apply Recommendation"}
</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Tips */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Quick Optimization Tips</CardTitle>
          <p className="text-gray-500">Additional ways to improve efficiency</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {additionalTips.map((tip, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <Badge
                    variant="secondary"
                    className={`${
                      tip.impact === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : tip.impact === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tip.impact}
                  </Badge>
                </div>
                <h4 className="mb-2 text-gray-900">{tip.title}</h4>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-900">Need Help Implementing?</h4>
              <p className="mb-4 text-gray-600">
                Our team can assist you in applying these recommendations to your infrastructure.
                Schedule a consultation to create a custom optimization plan.
              </p>
              <Button variant="outline" className="border-blue-200 bg-white hover:bg-blue-50">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRec && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
      <h3 className="text-xl font-semibold mb-3">{selectedRec.title}</h3>

      <p className="text-gray-600 mb-4">
        {selectedRec.description}
      </p>

      <div className="mb-4">
        <span className="font-medium text-gray-700">Impact:</span>{" "}
        <span className="text-emerald-600">{selectedRec.impact}</span>
      </div>

      <div className="mb-6">
        <span className="font-medium text-gray-700">Estimated CO₂ Savings:</span>{" "}
        <span className="text-emerald-600">
          {Number(selectedRec.co2_saving_kg).toFixed(2)} kg CO₂/month
        </span>
      </div>

      <Button
        className="w-full"
        onClick={() => setSelectedRec(null)}
      >
        Close
      </Button>
    </div>
  </div>
)}
    </div>
  );
}
