export async function fetchRecommendations() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/recommendations/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "bert-large",
        gpu_hours: 10,
        batch_size: 10,
        region: "pune",
        precision: "fp32",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = await res.json();
    return data.recommendations;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}