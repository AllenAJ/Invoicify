import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface ReturnData {
  totalEarned: number;
  monthlyEarnings: number;
  annualizedReturn: number;
  totalInvested: number;
  activeInvoices: number;
  paidInvoices: number;
  pendingReturns: number;
  lastPayment: string;
}

export default function CollectReturns() {
  const { address } = useAccount();
  const [returnData, setReturnData] = useState<ReturnData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);

  // Simulate loading return data
  useEffect(() => {
    const loadReturnData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      setReturnData({
        totalEarned: 1250.75,
        monthlyEarnings: 312.50,
        annualizedReturn: 13.2,
        totalInvested: 48500,
        activeInvoices: 3,
        paidInvoices: 7,
        pendingReturns: 187.25,
        lastPayment: '2024-01-20'
      });
      
      setIsLoading(false);
    };

    loadReturnData();
  }, []);

  const handleCollectReturns = async () => {
    if (!returnData || returnData.pendingReturns <= 0) {
      toast.error("No pending returns to collect");
      return;
    }

    setIsCollecting(true);
    
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Successfully collected ${returnData.pendingReturns} PYUSD in returns!`);
      
      // Update the data
      setReturnData(prev => prev ? {
        ...prev,
        totalEarned: prev.totalEarned + prev.pendingReturns,
        pendingReturns: 0,
        lastPayment: new Date().toISOString().split('T')[0]
      } : null);
    } catch (error) {
      toast.error("Failed to collect returns");
    } finally {
      setIsCollecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            4
          </div>
          <h3 className='text-lg font-bold'>Collect Returns</h3>
        </div>
        
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-500'>Loading your earnings data...</p>
        </div>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            4
          </div>
          <h3 className='text-lg font-bold'>Collect Returns</h3>
        </div>
        
        <div className='text-center py-8 text-gray-500'>
          <p>No investment data available</p>
          <p className='text-sm mt-1'>Deposit PYUSD to start earning returns</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          4
        </div>
        <h3 className='text-lg font-bold'>Collect Returns</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Earn fees when invoices are paid (8-15% APR) - collect your returns anytime
      </p>
      
      {/* Earnings Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
            ${returnData.totalEarned.toLocaleString()}
          </p>
          <p className='text-sm text-green-700 dark:text-green-300'>Total Earned</p>
        </div>
        
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
            ${returnData.monthlyEarnings.toLocaleString()}
          </p>
          <p className='text-sm text-blue-700 dark:text-blue-300'>This Month</p>
        </div>
        
        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
            {returnData.annualizedReturn}%
          </p>
          <p className='text-sm text-purple-700 dark:text-purple-300'>APR</p>
        </div>
        
        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
            ${returnData.pendingReturns.toLocaleString()}
          </p>
          <p className='text-sm text-yellow-700 dark:text-yellow-300'>Pending</p>
        </div>
      </div>
      
      {/* Investment Summary */}
      <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6'>
        <h4 className='font-semibold mb-3'>Investment Summary:</h4>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Total Invested:</span>
            <p className='font-semibold'>${returnData.totalInvested.toLocaleString()}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Active Invoices:</span>
            <p className='font-semibold'>{returnData.activeInvoices}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Paid Invoices:</span>
            <p className='font-semibold'>{returnData.paidInvoices}</p>
          </div>
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Last Payment:</span>
            <p className='font-semibold'>{new Date(returnData.lastPayment).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* Collect Returns */}
      <div className='space-y-4'>
        {returnData.pendingReturns > 0 ? (
          <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-semibold text-yellow-800 dark:text-yellow-200'>
                  Returns Ready to Collect
                </h4>
                <p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
                  You have ${returnData.pendingReturns.toLocaleString()} PYUSD in pending returns
                </p>
              </div>
              <button
                onClick={handleCollectReturns}
                disabled={isCollecting}
                className='bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-medium py-2 px-6 rounded-md transition-colors'
              >
                {isCollecting ? (
                  <div className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Collecting...
                  </div>
                ) : (
                  'Collect Returns'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center'>
            <p className='text-gray-600 dark:text-gray-400'>
              No pending returns at the moment
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              Returns will appear here as invoices are paid
            </p>
          </div>
        )}
        
        {/* Performance Chart Placeholder */}
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Performance Overview:</h4>
          <div className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
            <p>• Your investments are performing above market average</p>
            <p>• {returnData.annualizedReturn}% APR exceeds your target of 10%</p>
            <p>• Diversified across {returnData.activeInvoices + returnData.paidInvoices} invoices</p>
            <p>• {returnData.paidInvoices} invoices successfully paid with 0 defaults</p>
          </div>
        </div>
      </div>
    </div>
  );
}
