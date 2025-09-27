import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import toast from "react-hot-toast";

export default function AcceptOffer() {
  const { address } = useAccount();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const nativeBalance = useBalance({ address });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Mock offer data - in real app this would come from the quote
  const offerAmount = 8000; // PYUSD
  const invoiceAmount = 10000; // USD

  const handleAcceptOffer = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setHasAccepted(true);
      toast.success(`Successfully received ${offerAmount} PYUSD!`);
    } catch (error) {
      toast.error("Failed to process offer");
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasAccepted) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            ✓
          </div>
          <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>Offer Accepted!</h3>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400 mb-2'>
              ${offerAmount.toLocaleString()} PYUSD Received!
            </p>
            <p className='text-gray-600 dark:text-gray-400'>
              Funds have been transferred to your wallet
            </p>
          </div>
        </div>
        
        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>What happens next:</h4>
            <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• We'll collect the full ${invoiceAmount.toLocaleString()} from your customer</li>
              <li>• You keep the ${offerAmount.toLocaleString()} PYUSD (no repayment needed)</li>
              <li>• You'll receive updates on payment status</li>
              <li>• Transaction is complete - no further action required</li>
            </ul>
          </div>
          
          <div className='text-center'>
            <button
              onClick={() => {
                setHasAccepted(false);
                toast.success("Ready for your next invoice!");
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              Submit Another Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          3
        </div>
        <h3 className='text-lg font-bold'>Accept Offer</h3>
      </div>
      
      <div className='space-y-6'>
        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
          <div className='text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>You'll receive</p>
            <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
              ${offerAmount.toLocaleString()} PYUSD
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              for your ${invoiceAmount.toLocaleString()} invoice
            </p>
          </div>
        </div>
        
        {/* Wallet Balance Check */}
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
        
        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>Important:</h4>
          <ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
            <li>• You'll receive PYUSD immediately upon acceptance</li>
            <li>• We handle all customer collection</li>
            <li>• No repayment required from you</li>
            <li>• Transaction is final once accepted</li>
          </ul>
        </div>
        
        <div className='text-center'>
          <button
            onClick={handleAcceptOffer}
            disabled={isProcessing || !address}
            className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-md transition-colors'
          >
            {isProcessing ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Processing...
              </div>
            ) : (
              `Accept Offer - Receive ${offerAmount.toLocaleString()} PYUSD`
            )}
          </button>
          
          {!address && (
            <p className='text-sm text-gray-500 mt-2'>
              Please connect your wallet to accept the offer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
