export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface PriceData {
  date: string;
  price: number;
}

export interface TimeRangeButtonProps {
  range: string; // The time range value (e.g., "1", "7", "30")
  label: string; // The label for the button (e.g., "24 Hours", "7 Days")
  currentRange: string; // The currently selected time range
  onClick: (range: string) => void; // Function to handle button click
}

export interface CoinData {
  id: string;
  market_cap_rank: number;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}
