import { CryptoData } from '../types';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export async function getTopCryptos(count: number = 50): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false&locale=tr`
    );
    
    if (!response.ok) {
      throw new Error('API isteği başarısız oldu');
    }

    const data = await response.json();
    
    return data.map((coin: any) => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      imageUrl: coin.image,
      marketCap: coin.market_cap,
    }));
  } catch (error) {
    console.error('Kripto verileri alınamadı:', error);
    return [];
  }
}

export async function getBitcoinHistoricalData(): Promise<{ timestamp: string; price: number; }[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily`
    );
    
    if (!response.ok) {
      throw new Error('Geçmiş veri alınamadı');
    }

    const data = await response.json();
    
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp: new Date(timestamp).toISOString(),
      price,
    }));
  } catch (error) {
    console.error('Bitcoin geçmiş verileri alınamadı:', error);
    return [];
  }
}