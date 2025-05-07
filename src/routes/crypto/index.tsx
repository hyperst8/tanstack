import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { CoinData } from "../../types/cryptoTypes";

export const Route = createFileRoute("/crypto/")({
  component: CryptoLayout,
});

const columnHelper = createColumnHelper<CoinData>();

function CryptoLayout() {
  const navigate = useNavigate();

  const { data, error, isPending } = useQuery({
    queryKey: ["coins"],
    gcTime: 0,
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
      );

      return response.json();
    },
  });

  const columns = [
    columnHelper.accessor("market_cap_rank", { header: "Rank" }),
    columnHelper.accessor("name", {
      header: "Coin",
      cell: (info) => {
        const coin = info.row.original as CoinData;
        return (
          <div className="flex items-center gap-2">
            <img src={coin.image} alt={coin.name} className="w-6 h-6" />
            <span>{coin.name}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("current_price", {
      header: "Price",
      cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
    }),
    columnHelper.accessor("price_change_percentage_24h", {
      header: "Last 24h",
      cell: (info) => `${(info.getValue() as number).toFixed(2)}%`,
    }),
  ];

  const table = useReactTable<CoinData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    <div className="min-h-incl-header flex flex-col items-center mt-8">
      <h1 className="text-2xl">Crypto currencies</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-transparent border rounded-md shadow-md mt-4">
          <thead className="bg-blue-400 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left border-b">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-200 hover:text-black cursor-pointer"
                onClick={() =>
                  navigate({
                    to: "/crypto/$coinId",
                    params: { coinId: row.original.id },
                  })
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
