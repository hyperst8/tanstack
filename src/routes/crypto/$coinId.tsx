import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, PriceData } from "../../types/cryptoTypes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Route = createFileRoute("/crypto/$coinId")({
  component: CryptoChart,
});

function CryptoChart() {
  const { coinId } = useParams({ strict: false }) as { coinId: string };

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const { data, error, isPending } = useQuery({
    queryKey: ["coin", coinId],
    queryFn: () =>
      fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      ).then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      const prices: PriceData[] = data.prices.map(
        ([ts, price]: [number, number]) => ({
          date: new Date(ts).toLocaleDateString(),
          price,
        })
      );

      const chartData: ChartData = {
        labels: prices.map((p) => p.date),
        datasets: [
          {
            label: `${coinId.toUpperCase()} Price (USD)`,
            data: prices.map((p) => p.price),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
          },
        ],
      };

      setChartData(chartData);
    }
  }, [coinId, data]);

  if (isPending) {
    return (
      <div className="min-h-incl-header flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-incl-header flex justify-center items-center">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-xl my-8 mx-4">
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart for {coinId}...</p>
      )}
    </div>
  );
}
