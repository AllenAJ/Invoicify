import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";

export default function WalletInfo() {
  const { address } = useAccount();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const nativeBalance = useBalance({ address });

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <h2 className='text-lg font-bold mb-4'>Wallet Information</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='text-gray-500'>Address:</span>
          <p className='font-mono text-xs break-all'>{address}</p>
        </div>
        
        {nativeBalance.data && (
          <div>
            <span className='text-gray-500'>ETH Balance:</span>
            <p>{formatUnits(nativeBalance.data.value, nativeBalance.data.decimals)} {nativeBalance.data.symbol}</p>
          </div>
        )}
        
        {paymentToken.data && paymentTokenBalance.data && (
          <div>
            <span className='text-gray-500'>{paymentToken.data.symbol} Balance:</span>
            <p>{formatUnits(paymentTokenBalance.data, paymentToken.data.decimals)} {paymentToken.data.symbol}</p>
          </div>
        )}
      </div>
    </div>
  );
}
