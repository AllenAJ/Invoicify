import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, TrendingUp, DollarSign } from "lucide-react";
import { useInvoiceFactorPricing } from "@/hooks/usePythPrices";

interface InstantQuoteProps {
  quoteData?: {
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  } | null;
  invoiceAmount?: string;
  onAcceptQuote?: () => void;
  isProcessing?: boolean;
}

export default function InstantQuote({ quoteData: propQuoteData, invoiceAmount, onAcceptQuote, isProcessing }: InstantQuoteProps) {
  const { pyusdPrice, loading: priceLoading, lastUpdate, error } = useInvoiceFactorPricing();

  // Show processing state
  if (isProcessing) {
    return (
      <div className='minimal-card text-center space-y-8'>
        <div className='space-y-4'>
          <h2 className='text-4xl font-bold text-foreground'>
            Processing Transaction...
          </h2>
          <div className='flex items-center justify-center gap-3'>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className='text-lg text-muted-foreground'>
              Transferring PYUSD from liquidity pool...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only show quote if real data is provided
  if (!propQuoteData) {
    return (
      <div className='minimal-card text-center space-y-8'>
        <div className='space-y-4'>
          <h2 className='text-4xl font-bold text-foreground'>
            Your Quote
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Upload an invoice and click "Get Factoring Quote" to see your instant quote
          </p>
        </div>
      </div>
    );
  }

  // Convert prop data to display format
  const displayQuoteData = {
    invoiceAmount: parseFloat(invoiceAmount || '0'),
    offerAmount: parseFloat(propQuoteData.factorAmount),
    dueDate: propQuoteData.dueDate,
    status: 'ready' as const
  };

  return (
    <div className='minimal-card space-y-12'>
      <div className='text-center space-y-4'>
        <div className='flex justify-center mb-4'>
          <img 
            src="/PYUSD-token.png" 
            alt="PYUSD" 
            className="w-12 h-12 rounded-full shadow-md"
          />
        </div>
        <h2 className='text-4xl font-bold text-foreground'>
          Your Instant Quote
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Here's what we'll pay you for your invoice
        </p>
      </div>

      <div className='bg-primary/5 p-12 rounded-3xl text-center space-y-6'>
        <div className='space-y-4'>
          <p className='text-lg text-muted-foreground'>We'll pay you</p>
          <p className='text-6xl font-bold text-primary'>
            ${displayQuoteData.offerAmount.toLocaleString()}
          </p>
          <p className='text-lg text-muted-foreground'>
            PYUSD advance for your ${displayQuoteData.invoiceAmount.toLocaleString()} invoice
          </p>
          <p className='text-sm text-muted-foreground'>
            (Actually transfers 8 PYUSD from liquidity pool)
          </p>
        </div>
      </div>
      
      <div className='space-y-6'>
        {/* Live Pricing Section */}
        <div className='bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className='text-lg font-semibold text-blue-900 dark:text-blue-100'>Live Pricing</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${priceLoading ? 'bg-yellow-500' : pyusdPrice ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className='text-sm text-blue-700 dark:text-blue-300'>
                {priceLoading ? 'Loading...' : pyusdPrice ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>PYUSD Rate</span>
              </div>
              {priceLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded"></div>
              ) : pyusdPrice ? (
                <div>
                  <span className='text-xl font-bold text-green-700 dark:text-green-300'>
                    ${pyusdPrice.toFixed(6)}
                  </span>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Powered by Pyth Network
                  </div>
                </div>
              ) : (
                <span className='text-lg text-red-600 dark:text-red-400'>Unavailable</span>
              )}
            </div>
            
            <div className='bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Calculation</span>
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {pyusdPrice ? (
                  <div>
                    <div>8 PYUSD × ${pyusdPrice.toFixed(4)}</div>
                    <div className='font-semibold text-blue-700 dark:text-blue-300'>
                      = ${(8 * pyusdPrice).toFixed(2)} USD value
                    </div>
                  </div>
                ) : (
                  <div>8 PYUSD ≈ $8.00 USD</div>
                )}
              </div>
            </div>
          </div>
          
          {lastUpdate && (
            <div className='text-xs text-blue-600 dark:text-blue-400 mt-3 text-center'>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          
          {error && (
            <div className='text-xs text-amber-600 dark:text-amber-400 mt-3 text-center bg-amber-50 dark:bg-amber-900/20 p-2 rounded'>
              ⚠️ Using fallback pricing - {error}
            </div>
          )}
        </div>

        <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
          <span className='text-base font-medium text-foreground'>Invoice Amount</span>
          <span className='text-xl font-bold text-foreground'>${displayQuoteData.invoiceAmount.toLocaleString()}</span>
        </div>
        
        <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
          <span className='text-base font-medium text-foreground'>Due Date</span>
          <span className='text-xl font-bold text-foreground'>{new Date(displayQuoteData.dueDate).toLocaleDateString()}</span>
        </div>
        
        <div className='flex items-center justify-between p-6 bg-primary/10 rounded-2xl'>
          <span className='text-base font-medium text-primary'>You'll Receive</span>
          <span className='text-2xl font-bold text-primary'>${displayQuoteData.offerAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <div className='bg-muted p-8 rounded-3xl space-y-6'>
        <h3 className='text-2xl font-bold text-foreground text-center'>
          How it works
        </h3>
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-center'>
          <p className='text-sm text-blue-700 dark:text-blue-300'>
            💡 <strong>Note:</strong> The contract needs PYUSD in its liquidity pool to transfer funds. 
            If this fails, deposit PYUSD via the <strong>/investor</strong> route first.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>1</div>
              <div>
                <p className='font-medium text-foreground'>You receive 8 PYUSD immediately from liquidity pool</p>
                <p className='text-sm text-muted-foreground'>Fixed advance amount (shown as $8,000 in quote)</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>2</div>
              <div>
                <p className='font-medium text-foreground'>We collect from your customer</p>
                <p className='text-sm text-muted-foreground'>Full ${displayQuoteData.invoiceAmount.toLocaleString()} amount</p>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>3</div>
              <div>
                <p className='font-medium text-foreground'>No hidden fees</p>
                <p className='text-sm text-muted-foreground'>Transparent pricing</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>4</div>
              <div>
                <p className='font-medium text-foreground'>Instant settlement</p>
                <p className='text-sm text-muted-foreground'>Funds available immediately</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {propQuoteData && onAcceptQuote && (
        <Button
          onClick={onAcceptQuote}
          disabled={isProcessing}
          className="minimal-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              Storing Invoice & Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-3" />
              Accept Quote & Receive PYUSD
            </>
          )}
        </Button>
      )}
    </div>
  );
}
