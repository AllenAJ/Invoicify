import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import toast from "react-hot-toast";

interface PaymentData {
  invoiceId: string;
  amount: number;
  businessENS: string;
  businessAddress: string;
  factorAddress: string;
  businessAmount: number;
  factorAmount: number;
}

export default function PayWithPYUSD() {
  const { address } = useAccount();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const nativeBalance = useBalance({ address });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // Mock payment data - in real app this would come from the invoice lookup
  const mockPaymentData: PaymentData = {
    invoiceId: "INV-2024-001",
    amount: 15000,
    businessENS: "acme.eth",
    businessAddress: "0x1234567890123456789012345678901234567890",
    factorAddress: "0x0987654321098765432109876543210987654321",
    businessAmount: 12000, // 80% to business
    factorAmount: 3000     // 20% to factor
  };

  const handlePayInvoice = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!paymentTokenBalance.data || paymentTokenBalance.data < BigInt(mockPaymentData.amount * 1000000)) { // PYUSD has 6 decimals
      toast.error("Insufficient PYUSD balance");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      setPaymentData(mockPaymentData);
      setHasPaid(true);
      
      toast.success(`Successfully paid ${mockPaymentData.amount} PYUSD!`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPaid && paymentData) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            ✓
          </div>
          <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>Payment Successful!</h3>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400 mb-2'>
              ${paymentData.amount.toLocaleString()} PYUSD
            </p>
            <p className='text-gray-600 dark:text-gray-400'>
              Payment processed successfully
            </p>
          </div>
        </div>
        
        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Payment Details:</h4>
            <div className='space-y-2 text-sm text-blue-700 dark:text-blue-300'>
              <div className='flex justify-between'>
                <span>Invoice ID:</span>
                <span className='font-mono'>{paymentData.invoiceId}</span>
              </div>
              <div className='flex justify-between'>
                <span>Business (80%):</span>
                <span>${paymentData.businessAmount.toLocaleString()} PYUSD</span>
              </div>
              <div className='flex justify-between'>
                <span>Factor (20%):</span>
                <span>${paymentData.factorAmount.toLocaleString()} PYUSD</span>
              </div>
              <div className='flex justify-between border-t pt-2'>
                <span className='font-semibold'>Total Paid:</span>
                <span className='font-semibold'>${paymentData.amount.toLocaleString()} PYUSD</span>
              </div>
            </div>
          </div>
          
          <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-green-800 dark:text-green-200 mb-2'>What happens next:</h4>
            <ul className='text-sm text-green-700 dark:text-green-300 space-y-1'>
              <li>• Payment automatically splits between business and factor</li>
              <li>• Business receives ${paymentData.businessAmount.toLocaleString()} PYUSD immediately</li>
              <li>• Factor receives ${paymentData.factorAmount.toLocaleString()} PYUSD as return on investment</li>
              <li>• Invoice marked as paid in the system</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          2
        </div>
        <h3 className='text-lg font-bold'>Pay with PYUSD</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Pay using any PYUSD-compatible wallet - MetaMask, PayPal, or other Web3 wallets
      </p>
      
      <div className='space-y-6'>
        {/* Payment Summary */}
        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-purple-800 dark:text-purple-200 mb-3'>Payment Summary:</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-purple-700 dark:text-purple-300'>Invoice Amount:</span>
              <span className='font-semibold'>${mockPaymentData.amount.toLocaleString()} PYUSD</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-purple-700 dark:text-purple-300'>Business (80%):</span>
              <span>${mockPaymentData.businessAmount.toLocaleString()} PYUSD</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-purple-700 dark:text-purple-300'>Factor (20%):</span>
              <span>${mockPaymentData.factorAmount.toLocaleString()} PYUSD</span>
            </div>
            <div className='flex justify-between border-t pt-2'>
              <span className='font-semibold text-purple-800 dark:text-purple-200'>Total to Pay:</span>
              <span className='font-bold text-lg'>${mockPaymentData.amount.toLocaleString()} PYUSD</span>
            </div>
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
        
        {/* Payment Methods */}
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Supported Wallets:</h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
            <div className='text-center p-2 bg-white dark:bg-zinc-800 rounded border'>
              <p className='font-semibold'>MetaMask</p>
              <p className='text-xs text-gray-500'>Web3 Wallet</p>
            </div>
            <div className='text-center p-2 bg-white dark:bg-zinc-800 rounded border'>
              <p className='font-semibold'>PayPal</p>
              <p className='text-xs text-gray-500'>PYUSD Wallet</p>
            </div>
            <div className='text-center p-2 bg-white dark:bg-zinc-800 rounded border'>
              <p className='font-semibold'>WalletConnect</p>
              <p className='text-xs text-gray-500'>Mobile Wallets</p>
            </div>
            <div className='text-center p-2 bg-white dark:bg-zinc-800 rounded border'>
              <p className='font-semibold'>Coinbase</p>
              <p className='text-xs text-gray-500'>Web3 Wallet</p>
            </div>
          </div>
        </div>
        
        {/* Payment Button */}
        <div className='text-center'>
          <button
            onClick={handlePayInvoice}
            disabled={isProcessing || !address || !paymentTokenBalance.data || paymentTokenBalance.data < BigInt(mockPaymentData.amount * 1000000)}
            className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-md transition-colors'
          >
            {isProcessing ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${mockPaymentData.amount.toLocaleString()} PYUSD`
            )}
          </button>
          
          {!address && (
            <p className='text-sm text-gray-500 mt-2'>
              Please connect your wallet to make payment
            </p>
          )}
          
          {paymentTokenBalance.data && paymentTokenBalance.data < BigInt(mockPaymentData.amount * 1000000) && (
            <p className='text-sm text-red-500 mt-2'>
              Insufficient PYUSD balance. You need {mockPaymentData.amount.toLocaleString()} PYUSD.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
