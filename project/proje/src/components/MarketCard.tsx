import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { formatCurrency, formatPercent, cn } from '../lib/utils';

interface MarketCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  imageUrl?: string;
}

export function MarketCard({ name, symbol, price, change, volume, imageUrl }: MarketCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-500 text-sm">{symbol}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Fiyat</span>
          <span className="font-medium">{formatCurrency(price)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">24s Değişim</span>
          <div className={cn(
            "flex items-center gap-1 font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
            {formatPercent(change)}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Hacim</span>
          <span className="font-medium">{formatCurrency(volume)}</span>
        </div>
      </div>
    </div>
  );
}