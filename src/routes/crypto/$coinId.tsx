import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/crypto/$coinId")({
  component: CryptoChart,
});

function CryptoChart() {
  const { coinId } = useParams({ strict: false }) as { coinId: string };
  return <div>Hello {coinId}!</div>;
}
