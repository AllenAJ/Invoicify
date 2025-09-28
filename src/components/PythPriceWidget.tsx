import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { usePythPrices } from "@/hooks/usePythPrices";

interface PythPriceWidgetProps {
  symbols?: string[];
  showRefresh?: boolean;
  compact?: boolean;
  className?: string;
}

export default function PythPriceWidget({ 
  symbols = ['USD', 'ETH'], 
  showRefresh = true, 
  compact = false,
  className = ""
}: PythPriceWidgetProps) {
  const { prices, loading, error, lastUpdate, refresh } = usePythPrices(symbols);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatPrice = (price: number | null, symbol: string) => {
    if (price === null) return 'N/A';
    
    if (symbol === 'USD' || symbol === 'PYUSD') {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const getPriceChange = (symbol: string) => {
    // Mock price change for demo (in real app, you'd track historical data)
    const mockChanges: { [key: string]: number } = {
      'USD': 0,
      'PYUSD': 0.001,
      'ETH': -45.23,
      'BTC': 1250.45
    };
    return mockChanges[symbol] || 0;
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
        <span className="text-sm font-medium">
          {symbols.map(symbol => {
            const price = prices[symbol]?.price;
            return price ? `${symbol}: ${formatPrice(price, symbol)}` : `${symbol}: N/A`;
          }).join(' • ')}
        </span>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-muted rounded-2xl p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <h3 className="text-lg font-semibold text-foreground">Live Prices</h3>
          <Badge variant="outline" className="text-xs">
            Powered by Pyth
          </Badge>
        </div>
        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="minimal-button"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {error && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          ⚠️ Using fallback prices - Pyth Network unavailable
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {symbols.map(symbol => {
          const priceData = prices[symbol];
          const price = priceData?.price || null;
          const change = getPriceChange(symbol);
          
          return (
            <div key={symbol} className="bg-background rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {symbol === 'PYUSD' ? 'PayPal USD' : symbol}
                </span>
                <div className="flex items-center gap-1">
                  {getPriceChangeIcon(change)}
                  <span className={`text-xs ${getPriceChangeColor(change)}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-xl font-bold text-foreground">
                {loading ? (
                  <div className="animate-pulse bg-muted h-6 w-20 rounded"></div>
                ) : (
                  formatPrice(price, symbol)
                )}
              </div>
              
              {priceData && priceData.price && (
                <div className="text-xs text-muted-foreground">
                  Confidence: ±{((priceData.confidence / priceData.price) * 100).toFixed(3)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lastUpdate && (
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleString()}
        </div>
      )}
    </div>
  );
}
