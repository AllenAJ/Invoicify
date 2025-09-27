import { useState, useEffect } from "react";

interface SettlementData {
  invoiceId: string;
  totalAmount: number;
  businessAmount: number;
  factorAmount: number;
  businessAddress: string;
  factorAddress: string;
  businessENS: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  status: 'processing' | 'completed' | 'failed';
}

export default function AutomaticSettlement() {
  const [settlementData, setSettlementData] = useState<SettlementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate settlement process
  useEffect(() => {
    const simulateSettlement = async () => {
      setIsLoading(true);
      
      // Simulate processing time
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      
      // Mock settlement data
      const mockSettlement: SettlementData = {
        invoiceId: "INV-2024-001",
        totalAmount: 15000,
        businessAmount: 12000,
        factorAmount: 3000,
        businessAddress: "0x1234567890123456789012345678901234567890",
        factorAddress: "0x0987654321098765432109876543210987654321",
        businessENS: "acme.eth",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        blockNumber: 12345678,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setSettlementData(mockSettlement);
      setIsLoading(false);
    };

    simulateSettlement();
  }, []);

  if (isLoading) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            3
          </div>
          <h3 className='text-lg font-bold'>Automatic Settlement</h3>
        </div>
        
        <div className='text-center py-8'>
          <div className='mb-4'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2'>
              <div 
                className='bg-orange-600 h-3 rounded-full transition-all duration-300'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className='text-sm text-gray-500'>{progress}% Complete</p>
          </div>
          
          <p className='text-gray-500 mb-2'>Processing automatic settlement...</p>
          <p className='text-sm text-gray-400'>
            Payment is being split between business and factor
          </p>
        </div>
      </div>
    );
  }

  if (!settlementData) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            3
          </div>
          <h3 className='text-lg font-bold'>Automatic Settlement</h3>
        </div>
        
        <div className='text-center py-8 text-gray-500'>
          <p>No settlement data available</p>
          <p className='text-sm mt-1'>Complete a payment to see settlement details</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          ✓
        </div>
        <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>Settlement Complete!</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Payment automatically split between business and factor
      </p>
      
      {/* Settlement Summary */}
      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
        <div className='text-center'>
          <p className='text-2xl font-bold text-green-600 dark:text-green-400 mb-2'>
            ${settlementData.totalAmount.toLocaleString()}
          </p>
          <p className='text-gray-600 dark:text-gray-400'>
            Successfully settled
          </p>
        </div>
      </div>
      
      {/* Settlement Breakdown */}
      <div className='space-y-4 mb-6'>
        <h4 className='font-semibold text-gray-800 dark:text-gray-200'>Settlement Breakdown:</h4>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Business Payment */}
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h5 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Business Payment (80%)</h5>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-blue-700 dark:text-blue-300'>Amount:</span>
                <span className='font-semibold'>${settlementData.businessAmount.toLocaleString()} PYUSD</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-blue-700 dark:text-blue-300'>ENS:</span>
                <span className='font-mono text-blue-600 dark:text-blue-400'>{settlementData.businessENS}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-blue-700 dark:text-blue-300'>Address:</span>
                <span className='font-mono text-xs'>{settlementData.businessAddress.slice(0, 8)}...{settlementData.businessAddress.slice(-6)}</span>
              </div>
            </div>
          </div>
          
          {/* Factor Payment */}
          <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
            <h5 className='font-semibold text-purple-800 dark:text-purple-200 mb-2'>Factor Payment (20%)</h5>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-purple-700 dark:text-purple-300'>Amount:</span>
                <span className='font-semibold'>${settlementData.factorAmount.toLocaleString()} PYUSD</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-purple-700 dark:text-purple-300'>Type:</span>
                <span>Return on Investment</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-purple-700 dark:text-purple-300'>Address:</span>
                <span className='font-mono text-xs'>{settlementData.factorAddress.slice(0, 8)}...{settlementData.factorAddress.slice(-6)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transaction Details */}
      <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6'>
        <h4 className='font-semibold mb-3'>Transaction Details:</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Transaction Hash:</span>
            <p className='font-mono text-xs break-all'>{settlementData.transactionHash}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Block Number:</span>
            <p className='font-semibold'>{settlementData.blockNumber.toLocaleString()}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Timestamp:</span>
            <p className='font-semibold'>{new Date(settlementData.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Status:</span>
            <span className='px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
              {settlementData.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg'>
        <h4 className='font-semibold text-orange-800 dark:text-orange-200 mb-2'>How Automatic Settlement Works:</h4>
        <ul className='text-sm text-orange-700 dark:text-orange-300 space-y-1'>
          <li>• Smart contracts automatically split your payment</li>
          <li>• Business receives 80% of the invoice amount immediately</li>
          <li>• Factor receives 20% as return on their investment</li>
          <li>• All transactions are recorded on-chain for transparency</li>
          <li>• No manual intervention required - fully automated</li>
        </ul>
      </div>
    </div>
  );
}
