import { useState, useEffect, useCallback, useMemo } from 'react';
import { HermesClient } from '@pythnetwork/hermes-client';

// Pyth price feed IDs for relevant assets (from official Pyth documentation)
// Note: Pyth API returns IDs without 0x prefix, so we store them without 0x
const PRICE_FEED_IDS = {
  // ETH/USD - Official Pyth price feed ID
  ETH: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  // BTC/USD - Official Pyth price feed ID  
  BTC: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  // PYUSD/USD - Official Pyth price feed ID for PayPal USD
  PYUSD: 'c1da1b73d7f01e7ddd54b3766cf7fcd644395ad14f70aa706ec5384c59e76692',
  // USD is base currency (always 1.0)
  USD: null
};

interface PriceData {
  price: number;
  confidence: number;
  publishTime: number;
  expo: number;
}

interface PythPrices {
  [symbol: string]: PriceData | null;
}

export function usePythPrices(symbols: string[] = ['USD', 'ETH']) {
  const [prices, setPrices] = useState<PythPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Create hermesClient only once to avoid re-creating on every render
  const hermesClient = useMemo(() => new HermesClient('https://hermes.pyth.network'), []);
  
  // Memoize symbols array to prevent unnecessary re-renders
  const memoizedSymbols = useMemo(() => symbols, [symbols.join(',')]);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      
      // Get price feed IDs for requested symbols (filter out null values)
      const symbolsWithIds = memoizedSymbols.filter(symbol => PRICE_FEED_IDS[symbol as keyof typeof PRICE_FEED_IDS] !== null);
      const priceIds = symbolsWithIds.map(symbol => PRICE_FEED_IDS[symbol as keyof typeof PRICE_FEED_IDS]).filter(Boolean) as string[];
      
      const newPrices: PythPrices = {};
      
      // Handle symbols with fixed prices (only USD)
      memoizedSymbols.forEach(symbol => {
        if (symbol === 'USD') {
          newPrices[symbol] = {
            price: 1.0, // USD is always $1 (base currency)
            confidence: 0.001, // Very low confidence interval for base currency
            publishTime: Date.now() / 1000,
            expo: -8
          };
        }
      });

      // Fetch live prices from Pyth for symbols that have price feeds
      if (priceIds.length > 0) {
        const priceFeeds = await hermesClient.getLatestPriceUpdates(priceIds);
        
        if (priceFeeds.parsed) {
          symbolsWithIds.forEach((symbol) => {
            const priceId = PRICE_FEED_IDS[symbol as keyof typeof PRICE_FEED_IDS];
            if (priceId) {
              const feed = priceFeeds.parsed!.find(p => p.id === priceId);
              if (feed && feed.price) {
                newPrices[symbol] = {
                  price: Number(feed.price.price) * Math.pow(10, feed.price.expo),
                  confidence: Number(feed.price.conf) * Math.pow(10, feed.price.expo),
                  publishTime: Number(feed.price.publish_time), // Fixed: use publish_time not publishTime
                  expo: feed.price.expo
                };
              } else {
                newPrices[symbol] = null;
              }
            }
          });
        }
      }

      setPrices(newPrices);
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error fetching Pyth prices:', err);
      setError(err.message || 'Failed to fetch price data');
      setLoading(false);
      
      // Fallback to mock data for demo purposes
      const mockPrices: PythPrices = {};
      memoizedSymbols.forEach(symbol => {
        if (symbol === 'ETH') {
          mockPrices[symbol] = {
            price: 2400, // Mock ETH at $2400
            confidence: 1.0,
            publishTime: Date.now() / 1000,
            expo: -8
          };
        } else if (symbol === 'BTC') {
          mockPrices[symbol] = {
            price: 65000, // Mock BTC at $65,000
            confidence: 100.0,
            publishTime: Date.now() / 1000,
            expo: -8
          };
        } else if (symbol === 'PYUSD') {
          mockPrices[symbol] = {
            price: 1.0, // Mock PYUSD at $1 (should be close to $1 but can fluctuate slightly)
            confidence: 0.005,
            publishTime: Date.now() / 1000,
            expo: -8
          };
        } else {
          mockPrices[symbol] = {
            price: 1.0, // USD at $1
            confidence: 0.001,
            publishTime: Date.now() / 1000,
            expo: -8
          };
        }
      });
      setPrices(mockPrices);
    }
  }, [memoizedSymbols, hermesClient]);

  // Fetch prices on mount and set up polling
  useEffect(() => {
    console.log('🚀 Setting up price polling - this should only happen once per hook instance');
    fetchPrices();
    
    // Update prices every 2 minutes
    const interval = setInterval(() => {
      console.log('⏰ 2-minute interval triggered - fetching prices');
      fetchPrices();
    }, 120000);
    
    return () => {
      console.log('🧹 Cleaning up price polling interval');
      clearInterval(interval);
    };
  }, [fetchPrices]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true);
    fetchPrices();
  }, [fetchPrices]);

  // Helper functions
  const getPrice = useCallback((symbol: string): number | null => {
    return prices[symbol]?.price || null;
  }, [prices]);

  const getPriceWithConfidence = useCallback((symbol: string) => {
    const priceData = prices[symbol];
    if (!priceData) return null;
    
    return {
      price: priceData.price,
      confidence: priceData.confidence,
      confidencePercent: (priceData.confidence / priceData.price) * 100
    };
  }, [prices]);

  // Calculate conversion rates
  const convertPrice = useCallback((amount: number, fromSymbol: string, toSymbol: string): number | null => {
    const fromPrice = getPrice(fromSymbol);
    const toPrice = getPrice(toSymbol);
    
    if (!fromPrice || !toPrice) return null;
    
    return (amount * fromPrice) / toPrice;
  }, [getPrice]);

  // Calculate factor amount with real-time pricing
  const calculateFactorAmount = useCallback((invoiceAmountUSD: number, factorRate: number = 0.8): number | null => {
    const pyusdPrice = getPrice('PYUSD') || getPrice('USD'); // PYUSD should be ~$1
    if (!pyusdPrice) return null;
    
    const factorAmountUSD = invoiceAmountUSD * factorRate;
    return factorAmountUSD / pyusdPrice; // Convert USD to PYUSD
  }, [getPrice]);

  return {
    prices,
    loading,
    error,
    lastUpdate,
    refresh,
    getPrice,
    getPriceWithConfidence,
    convertPrice,
    calculateFactorAmount,
    // Convenience getters
    ethPrice: getPrice('ETH'),
    usdPrice: getPrice('USD'),
    pyusdPrice: getPrice('PYUSD') || getPrice('USD'), // Fallback to USD for PYUSD
  };
}

// Hook specifically for invoice factoring calculations
export function useInvoiceFactorPricing() {
  const { calculateFactorAmount, pyusdPrice, loading, error, lastUpdate, refresh } = usePythPrices(['PYUSD', 'ETH', 'USD']);
  
  const getFactorQuote = useCallback((invoiceAmountUSD: number, factorRate: number = 0.8) => {
    const factorAmountPYUSD = calculateFactorAmount(invoiceAmountUSD, factorRate);
    
    if (!factorAmountPYUSD || !pyusdPrice) {
      // Fallback calculation if Pyth is unavailable
      return {
        factorAmount: invoiceAmountUSD * factorRate,
        factorAmountPYUSD: invoiceAmountUSD * factorRate, // Assume 1:1 USD:PYUSD
        fee: invoiceAmountUSD * (1 - factorRate),
        netAmount: invoiceAmountUSD * factorRate,
        pyusdRate: 1,
        isLive: false
      };
    }
    
    return {
      factorAmount: invoiceAmountUSD * factorRate,
      factorAmountPYUSD,
      fee: invoiceAmountUSD * (1 - factorRate),
      netAmount: invoiceAmountUSD * factorRate,
      pyusdRate: pyusdPrice,
      isLive: true
    };
  }, [calculateFactorAmount, pyusdPrice]);
  
  return {
    getFactorQuote,
    pyusdPrice,
    loading,
    error,
    lastUpdate,
    refresh
  };
}
