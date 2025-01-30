import React, { useState, useEffect } from 'react';
import { Coins, RefreshCcw, DollarSign } from 'lucide-react';
import { MarketCard } from './components/MarketCard';
import { PriceChart } from './components/PriceChart';
import { getTopCryptos, getBitcoinHistoricalData } from './lib/api';
import type { CryptoData } from './types';

const forexData = [
  {
    name: 'EUR/USD',
    symbol: 'EUR/USD',
    price: 1.0923,
    change: 0.15,
    volume: 98372834.23,
  },
  {
    name: 'GBP/USD',
    symbol: 'GBP/USD',
    price: 1.2634,
    change: -0.32,
    volume: 67283923.12,
  },
];

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [chartData, setChartData] = useState<{ timestamp: string; price: number; }[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [displayCount, setDisplayCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [cryptos, historicalData] = await Promise.all([
        getTopCryptos(50),
        getBitcoinHistoricalData()
      ]);

      setCryptoData(cryptos);
      setChartData(historicalData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Her dakika güncelle
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Panda Tracker</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Crypto Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Coins className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold">Kripto Para Piyasaları</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && displayCount === 9 ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              ) : (
                cryptoData.slice(0, displayCount).map((crypto) => (
                  <MarketCard key={crypto.symbol} {...crypto} />
                ))
              )}
            </div>
            {displayCount < cryptoData.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 9, cryptoData.length))}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Daha Fazla Göster
                </button>
              </div>
            )}
            <div className="mt-6 bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Bitcoin Fiyat Grafiği (30 Gün)</h3>
              {isLoading ? (
                <div className="h-[300px] bg-gray-100 animate-pulse rounded" />
              ) : (
                <PriceChart data={chartData} color="#6366f1" />
              )}
            </div>
          </section>

          {/* Forex Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Döviz Piyasaları</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forexData.map((forex) => (
                <MarketCard key={forex.symbol} {...forex} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;