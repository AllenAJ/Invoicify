import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Coins, DollarSign } from "lucide-react";

export default function WalletInfo() {
  const { address } = useAccount();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const nativeBalance = useBalance({ address });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Address</Badge>
            </div>
            <p className='font-mono text-sm break-all text-muted-foreground'>{address}</p>
          </div>
          
          {nativeBalance.data && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <Badge variant="secondary">ETH Balance</Badge>
              </div>
              <p className="text-lg font-semibold">
                {formatUnits(nativeBalance.data.value, nativeBalance.data.decimals)} {nativeBalance.data.symbol}
              </p>
            </div>
          )}
          
          {paymentToken.data && paymentTokenBalance.data && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <Badge variant="secondary">{paymentToken.data.symbol} Balance</Badge>
              </div>
              <p className="text-lg font-semibold">
                {formatUnits(paymentTokenBalance.data, paymentToken.data.decimals)} {paymentToken.data.symbol}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
