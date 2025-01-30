import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/utils';

interface PriceChartProps {
  data: Array<{
    timestamp: string;
    price: number;
  }>;
  color?: string;
}

export function PriceChart({ data, color = "#6366f1" }: PriceChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Fiyat']}
            labelFormatter={(label) => new Date(label).toLocaleString('tr-TR')}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}