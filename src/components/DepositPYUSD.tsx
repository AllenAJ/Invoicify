import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import toast from "react-hot-toast";

export default function DepositPYUSD() {
  const { address } = useAccount();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const nativeBalance = useBalance({ address });
  
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [depositedAmount, setDepositedAmount] = useState(0);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsDepositing(true);
    
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const amount = parseFloat(depositAmount);
      setDepositedAmount(amount);
      setHasDeposited(true);
      setDepositAmount("");
      
      toast.success(`Successfully deposited ${amount} PYUSD to liquidity pool!`);
    } catch (error) {
      toast.error("Failed to deposit PYUSD");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    setIsDepositing(true);
    
    try {
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasDeposited(false);
      setDepositedAmount(0);
      
      toast.success(`Successfully withdrew ${depositedAmount} PYUSD from liquidity pool!`);
    } catch (error) {
      toast.error("Failed to withdraw PYUSD");
    } finally {
      setIsDepositing(false);
    }
  };

  if (hasDeposited) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            ✓
          </div>
          <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>PYUSD Deposited!</h3>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400 mb-2'>
              {depositedAmount.toLocaleString()} PYUSD
            </p>
            <p className='text-gray-600 dark:text-gray-400'>
              Deposited to liquidity pool
            </p>
          </div>
        </div>
        
        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>What happens next:</h4>
            <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• Your PYUSD is now earning yield in the liquidity pool</li>
              <li>• Smart contracts automatically match your funds with invoices</li>
              <li>• You'll earn fees when invoices are paid (8-15% APR)</li>
              <li>• You can withdraw your funds anytime</li>
            </ul>
          </div>
          
          <div className='text-center'>
            <button
              onClick={handleWithdraw}
              disabled={isDepositing}
              className='bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              {isDepositing ? 'Withdrawing...' : 'Withdraw PYUSD'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          1
        </div>
        <h3 className='text-lg font-bold'>Deposit PYUSD</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Add PYUSD to the liquidity pool to start earning yield on invoice factoring
      </p>
      
      <div className='space-y-6'>
        {/* Current Balance Display */}
        {paymentToken.data && paymentTokenBalance.data && (
          <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
            <h4 className='font-semibold mb-2'>Your Wallet Balance:</h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-600 dark:text-gray-400'>ETH:</span>
                <p className='font-semibold'>
                  {nativeBalance.data ? `${nativeBalance.data.formatted} ${nativeBalance.data.symbol}` : 'Loading...'}
                </p>
              </div>
              <div>
                <span className='text-gray-600 dark:text-gray-400'>{paymentToken.data.symbol}:</span>
                <p className='font-semibold'>
                  {paymentTokenBalance.data ? `${paymentTokenBalance.data.formatted} ${paymentToken.data.symbol}` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Deposit Form */}
        <div>
          <label htmlFor='depositAmount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Amount to Deposit (PYUSD)
          </label>
          <input
            type='number'
            id='depositAmount'
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
            placeholder='1000'
            step='0.01'
            min='0'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Minimum deposit: 100 PYUSD
          </p>
        </div>
        
        {/* Expected Returns */}
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-green-800 dark:text-green-200 mb-2'>Expected Returns:</h4>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-green-700 dark:text-green-300'>APR Range:</span>
              <p className='font-semibold text-green-600 dark:text-green-400'>8% - 15%</p>
            </div>
            <div>
              <span className='text-green-700 dark:text-green-300'>Monthly Yield:</span>
              <p className='font-semibold text-green-600 dark:text-green-400'>
                {depositAmount ? `$${(parseFloat(depositAmount) * 0.01).toFixed(2)}` : '$0.00'}
              </p>
            </div>
          </div>
        </div>
        
        <div className='text-center'>
          <button
            onClick={handleDeposit}
            disabled={isDepositing || !address || !depositAmount || parseFloat(depositAmount) < 100}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-md transition-colors'
          >
            {isDepositing ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Depositing...
              </div>
            ) : (
              'Deposit PYUSD to Liquidity Pool'
            )}
          </button>
          
          {!address && (
            <p className='text-sm text-gray-500 mt-2'>
              Please connect your wallet to deposit PYUSD
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
