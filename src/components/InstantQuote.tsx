import { useState, useEffect } from "react";

interface QuoteData {
  invoiceAmount: number;
  offerAmount: number;
  discountRate: number;
  processingFee: number;
  netAmount: number;
  dueDate: string;
  riskScore: string;
  status: 'calculating' | 'ready' | 'error';
}

export default function InstantQuote() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Simulate getting a quote when component mounts
  useEffect(() => {
    const calculateQuote = async () => {
      setIsCalculating(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock quote calculation
      const invoiceAmount = 10000; // Example amount
      const discountRate = 0.02; // 2% per month
      const processingFee = 0.005; // 0.5% processing fee
      const monthsToDue = 1; // Assume 1 month to due date
      
      const discountAmount = invoiceAmount * discountRate * monthsToDue;
      const feeAmount = invoiceAmount * processingFee;
      const netAmount = invoiceAmount - discountAmount - feeAmount;
      
      setQuoteData({
        invoiceAmount,
        offerAmount: netAmount,
        discountRate: discountRate * 100,
        processingFee: processingFee * 100,
        netAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        riskScore: 'Low',
        status: 'ready'
      });
      
      setIsCalculating(false);
    };

    calculateQuote();
  }, []);

  if (isCalculating) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            2
          </div>
          <h3 className='text-lg font-bold'>Get Instant Quote</h3>
        </div>
        
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-500'>Calculating your instant quote...</p>
          <p className='text-sm text-gray-400 mt-2'>
            Analyzing invoice details and risk factors
          </p>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            2
          </div>
          <h3 className='text-lg font-bold'>Get Instant Quote</h3>
        </div>
        
        <div className='text-center py-8'>
          <p className='text-gray-500'>Upload an invoice to get your instant quote</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          2
        </div>
        <h3 className='text-lg font-bold'>Your Instant Quote</h3>
      </div>
      
      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>We'll pay you</p>
          <p className='text-3xl font-bold text-green-600 dark:text-green-400'>
            ${quoteData.offerAmount.toLocaleString()} PYUSD
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            for your ${quoteData.invoiceAmount.toLocaleString()} invoice
          </p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Invoice Amount:</span>
            <span className='font-semibold'>${quoteData.invoiceAmount.toLocaleString()}</span>
          </div>
          
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Discount Rate:</span>
            <span className='font-semibold'>{quoteData.discountRate}%</span>
          </div>
          
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Processing Fee:</span>
            <span className='font-semibold'>{quoteData.processingFee}%</span>
          </div>
        </div>
        
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Due Date:</span>
            <span className='font-semibold'>{new Date(quoteData.dueDate).toLocaleDateString()}</span>
          </div>
          
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Risk Score:</span>
            <span className={`font-semibold px-2 py-1 rounded text-xs ${
              quoteData.riskScore === 'Low' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {quoteData.riskScore}
            </span>
          </div>
          
          <div className='flex justify-between border-t pt-2'>
            <span className='text-gray-600 dark:text-gray-400'>Net Amount:</span>
            <span className='font-bold text-lg'>${quoteData.netAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
        <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>How it works:</h4>
        <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
          <li>• You receive ${quoteData.offerAmount.toLocaleString()} PYUSD immediately</li>
          <li>• We collect the full ${quoteData.invoiceAmount.toLocaleString()} from your customer</li>
          <li>• No hidden fees or surprises</li>
          <li>• Funds available in your wallet instantly</li>
        </ul>
      </div>
    </div>
  );
}
