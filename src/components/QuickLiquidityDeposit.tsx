import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useInvoiceFactoring } from "@/hooks/invoiceFactoring";
import { getContractAddress } from "@/config/contract";
import { useTokenBalance } from "@/hooks/erc20";
import { usePaymentTokenAddress } from "@/hooks/paymentToken";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import toast from "react-hot-toast";
import { InvoiceFactoringABI } from "@/abi/InvoiceFactoring";

export default function QuickLiquidityDeposit() {
  const { address } = useAccount();
  const { depositLiquidity } = useInvoiceFactoring();
  const [amount, setAmount] = useState("1");
  const [isDepositing, setIsDepositing] = useState(false);
  const [copied, setCopied] = useState(false);

  const contractAddress = getContractAddress();
  const paymentTokenAddress = usePaymentTokenAddress();
  const pyusdBalance = useTokenBalance(paymentTokenAddress, address);
  
  // Check contract's liquidity balance
  const contractLiquidity = useReadContract({
    address: contractAddress,
    abi: InvoiceFactoringABI,
    functionName: 'getAvailableLiquidity',
  });

  const handleDeposit = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsDepositing(true);
    
    try {
      console.log('Attempting to deposit liquidity:', {
        amount,
        address,
        contractAddress
      });
      
      toast.loading("🔄 First approving PYUSD spending, then depositing...", { duration: 3000 });
      await depositLiquidity(amount);
      toast.success(`Successfully deposited ${amount} PYUSD to liquidity pool!`);
      setAmount("1"); // Reset to default
    } catch (error: any) {
      console.error("Error depositing liquidity:", error);
      
      // Provide specific error messages
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('Insufficient')) {
        toast.error("❌ Insufficient PYUSD balance. You need more PYUSD in your wallet.");
      } else if (errorMessage.includes('allowance') || errorMessage.includes('approve')) {
        toast.error("❌ Need to approve PYUSD spending. Please approve the contract to spend your PYUSD first.");
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        toast.error("❌ Transaction was rejected. Please try again and confirm the transaction.");
      } else {
        toast.error(`❌ Deposit failed: ${errorMessage}`);
      }
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast.success("Contract address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className='minimal-card'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-foreground text-center'>
          🚀 Quick Liquidity Deposit
        </CardTitle>
        <p className='text-center text-muted-foreground'>
          Add PYUSD to the liquidity pool to enable invoice payments
        </p>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Contract Status */}
        <div className='space-y-3'>
          <Label className='text-base font-medium text-foreground'>
            Contract Status
          </Label>
          <div className='flex items-center justify-between p-4 bg-muted rounded-2xl'>
            <span className='text-sm font-medium text-foreground'>Available Liquidity</span>
            <Badge variant={contractLiquidity.data && parseFloat(formatUnits(contractLiquidity.data, 6)) >= 8 ? "default" : "destructive"} className='text-sm'>
              {contractLiquidity.data ? `${formatUnits(contractLiquidity.data, 6)} PYUSD` : 'Loading...'}
            </Badge>
          </div>
          {contractLiquidity.data && contractLiquidity.data > 0n && parseFloat(formatUnits(contractLiquidity.data, 6)) < 8 ? (
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3'>
              <p className='text-sm text-red-700 dark:text-red-300'>
                ⚠️ Contract needs at least 8 PYUSD liquidity to process invoices. Deposit more PYUSD below.
              </p>
            </div>
          ) : null}
        </div>

        {/* Contract Address */}
        <div className='space-y-3'>
          <Label className='text-base font-medium text-foreground'>
            Contract Address
          </Label>
          <div className='flex gap-3'>
            <Input
              value={contractAddress}
              readOnly
              className='minimal-input flex-grow font-mono text-sm'
            />
            <Button
              onClick={handleCopyAddress}
              variant="outline"
              size="icon"
              className='minimal-button'
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
              variant="outline"
              size="icon"
              className='minimal-button'
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Deposit Form */}
        <div className='space-y-4'>
          <div className='space-y-3'>
            <Label htmlFor='depositAmount' className='text-base font-medium text-foreground'>
              Amount (PYUSD)
            </Label>
            <Input
              type='number'
              id='depositAmount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='1'
              step='0.01'
              min='0.01'
              className='minimal-input'
            />
            {pyusdBalance.data && pyusdBalance.data > 0n ? (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <DollarSign className="h-4 w-4" />
                <span>Your PYUSD balance: {formatUnits(pyusdBalance.data, 6)} PYUSD</span>
              </div>
            ) : null}
          </div>

          <Button
            onClick={handleDeposit}
            disabled={isDepositing || !address}
            className='minimal-button w-full bg-primary text-primary-foreground hover:bg-primary/90'
            size="lg"
          >
            {isDepositing ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Depositing...
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5 mr-3" />
                Deposit {amount} PYUSD
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        {/* <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge variant="secondary" className='text-xs'>
              💡 Tip
            </Badge>
            <h4 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Quick Setup
            </h4>
          </div>
          {/* <div className='text-sm text-blue-700 dark:text-blue-300 space-y-2'>
            <p>• <strong>Minimum:</strong> 1 PYUSD to get started</p>
            <p>• <strong>Purpose:</strong> Enables customer payments to work</p>
            <p>• <strong>Returns:</strong> Earn from customer payments</p>
            <p>• <strong>Flexible:</strong> Withdraw anytime</p>
          </div> 
        </div> */}

        {/* Alternative Method */}
        <div className='text-center space-y-3'>
          <p className='text-sm text-muted-foreground'>
            Or send PYUSD directly to the contract address from your wallet
          </p>
          <div className='flex justify-center gap-2'>
            <Badge variant="outline" className='text-xs'>
              Network: ETH Sepolia
            </Badge>
            <Badge variant="outline" className='text-xs'>
              Token: PYUSD
            </Badge>
          </div>
        </div>

        {/* Help Section */}
        {/* <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-3'>
          <div className='flex items-center gap-2'>
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h4 className='font-medium text-blue-800 dark:text-blue-200'>Common Issues:</h4>
          </div>
          <div className='text-sm text-blue-700 dark:text-blue-300 space-y-2'>
            <p>• <strong>Two transactions:</strong> First approves PYUSD spending, then deposits to contract</p>
            <p>• <strong>Insufficient balance:</strong> Make sure you have enough PYUSD in your wallet</p>
            <p>• <strong>Network issues:</strong> Make sure you're connected to ETH Sepolia testnet</p>
            <p>• <strong>Transaction rejected:</strong> Check your wallet and confirm both transactions</p>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
