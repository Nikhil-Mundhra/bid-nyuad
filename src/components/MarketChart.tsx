"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type Point = {
  id: string;
  createdAt: string | Date;
  rate: number | string;
  baseAmount: number | string;
  quoteAmount: number | string;
  status: string;
};

export function MarketChart({ points }: { points: Point[] }) {
  const data = points.map((point) => ({
    ...point,
    rate: Number(point.rate),
    label: new Date(point.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    })
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#ded9ca" strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[(dataMin: number) => Math.max(0, dataMin - 0.05), (dataMax: number) => dataMax + 0.05]}
            tickFormatter={(value) => Number(value).toFixed(2)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(23,32,42,0.12)"
            }}
            formatter={(value, name, item) => [
              `${Number(value).toFixed(3)} rate`,
              `${item.payload.quoteAmount} for ${item.payload.baseAmount}`
            ]}
            labelFormatter={(label) => `Trade trend: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#19647e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#b45f3c", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
