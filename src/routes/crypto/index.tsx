import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/crypto/")({
  component: CryptoLayout,
});

function CryptoLayout() {
  return (
    <div className="min-h-incl-header flex flex-col items-center mt-8">
      <h1 className="text-2xl">Crypto currencies</h1>
      <div className="flex flex-col gap-2 my-4 p-4 border rounded-md shadow-md bg-transparent">
        <Link to="/crypto/$coinId" params={{ coinId: "bitcoin" }}>
          Bitcoin
        </Link>
        <Link to="/crypto/$coinId" params={{ coinId: "tether" }}>
          Tether
        </Link>
        <Link to="/crypto/$coinId" params={{ coinId: "ethereum" }}>
          Ethereum
        </Link>
      </div>
    </div>
  );
}
