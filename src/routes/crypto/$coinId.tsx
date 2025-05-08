import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import TimeRangeButton from "../../components/timeRangeButton";

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
  const [timeRange, setTimeRange] = useState<string>("30");

  const { data, error, isPending } = useQuery({
    queryKey: ["coin", coinId, timeRange],
    gcTime: 0,
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeRange}&interval=daily`
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

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  if (isPending) {
    return <div className="min-h-incl-header center-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-incl-header center-container">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <Link to="/crypto" className="ml-8 hover:underline hover:font-bold">
        Back
      </Link>
      <div className="bg-white rounded-xl p-4 shadow-xl my-8 mx-4">
        {data ? (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <TimeRangeButton
                range="1"
                label="24 Hours"
                currentRange={timeRange}
                onClick={handleTimeRangeChange}
              />
              <TimeRangeButton
                range="7"
                label="7 Days"
                currentRange={timeRange}
                onClick={handleTimeRangeChange}
              />
              <TimeRangeButton
                range="30"
                label="1 Month"
                currentRange={timeRange}
                onClick={handleTimeRangeChange}
              />
              <TimeRangeButton
                range="90"
                label="3 Months"
                currentRange={timeRange}
                onClick={handleTimeRangeChange}
              />
              <TimeRangeButton
                range="365"
                label="1 Year"
                currentRange={timeRange}
                onClick={handleTimeRangeChange}
              />
            </div>
            <Line data={data} />
          </>
        ) : (
          <p>Loading chart for {coinId}...</p>
        )}
      </div>
    </div>
  );
}
