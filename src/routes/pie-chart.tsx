import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { CovidData } from "../types/covidTypes";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute("/pie-chart")({
  component: PieChartPage,
});

function PieChartPage() {
  const [dataType, setDataType] = useState<string>("cases");

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<CovidData[], Error>({
    queryKey: ["covidData"],
    queryFn: async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      if (!response.ok) throw new Error("Failed to fetch data.");

      const json = await response.json();

      return json.slice(0, 5).map((covid: CovidData) => ({
        name: covid.country,
        cases: covid.cases,
        deaths: covid.deaths,
        recovered: covid.recovered,
      }));
    },
  });

  if (isLoading)
    return <div className="min-h-incl-header center-container">Loading...</div>;
  if (error)
    return (
      <div className="min-h-incl-header center-container">
        Error: {error.message}
      </div>
    );

  const labels = data.map((d) => d.name);
  const values = data.map((d) => d[dataType as keyof CovidData]);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#F44336",
          "#2196F3",
          "#9C27B0",
        ],
        hoverBackgroundColor: [
          "#66BB6A",
          "#FFB74D",
          "#EF5350",
          "#42A5F5",
          "#AB47BC",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-incl-header flex flex-col items-center mt-8">
      <h1 className="text-2xl text-center mb-4">
        Top 5 Countries by COVID-19{" "}
        {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
      </h1>
      <div className="flex gap-2 mt-4 mb-6">
        {["cases", "deaths", "recovered"].map((type) => (
          <button
            key={type}
            onClick={() => setDataType(type)}
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors duration-200 ${dataType === type ? "bg-blue-600 text-white shadow-md border border-blue-600" : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="w-full max-w-3xl flex justify-center">
        <div className="w-full h-[260px] md:h-[400px]">
          <Pie
            data={chartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: "#ffffff",
                    boxWidth: 20,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
