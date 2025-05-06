import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ChartData, PriceData } from "../../types/cryptoTypes";
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

  const { data, error, isPending } = useQuery({
    queryKey: ["coin", coinId],
    gcTime: 0,
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const result = await response.json();

      const prices: PriceData[] = result.prices.map(
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

      return chartData;
    },
  });

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
      {data ? <Line data={data} /> : <p>Loading chart for {coinId}...</p>}
    </div>
  );
}
