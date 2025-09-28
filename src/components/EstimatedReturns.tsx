import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { useInvoiceFactoring } from "@/hooks/invoiceFactoring";
import { getContractAddress } from "@/config/contract";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { InvoiceFactoringABI } from "@/abi/InvoiceFactoring";
import toast from "react-hot-toast";

export default function EstimatedReturns() {
  const { address } = useAccount();
  const { collectReturns } = useInvoiceFactoring();
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);

  const contractAddress = getContractAddress();
  
  // Get available liquidity from contract
  const contractLiquidity = useReadContract({
    address: contractAddress,
    abi: InvoiceFactoringABI,
    functionName: 'getAvailableLiquidity',
  });

  // Calculate estimated returns (2.5% of available liquidity)
  const availableLiquidity = contractLiquidity.data ? parseFloat(formatUnits(contractLiquidity.data, 6)) : 0;
  const estimatedReturn = availableLiquidity * 0.025; // 2.5%
  const annualizedReturn = estimatedReturn * 12; // Assuming monthly claims
  const annualizedAPR = availableLiquidity > 0 ? (annualizedReturn / availableLiquidity) * 100 : 0;

  // Set up claim timing (every 3 months)
  useEffect(() => {
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
    setNextClaimTime(threeMonthsFromNow);
    
    // Check if there's a stored last claim time
    const stored = localStorage.getItem('lastClaimTime');
    if (stored) {
      setLastClaimTime(new Date(stored));
    }
  }, []);

  const canClaim = () => {
    if (!lastClaimTime) return true; // First time claiming
    const now = new Date();
    const timeSinceLastClaim = now.getTime() - lastClaimTime.getTime();
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000; // 90 days
    return timeSinceLastClaim >= threeMonthsInMs;
  };

  const handleClaimReturns = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!canClaim()) {
      toast.error("You can only claim returns every 3 months");
      return;
    }

    if (estimatedReturn <= 0) {
      toast.error("No returns available to claim");
      return;
    }

    setIsClaiming(true);
    
    try {
      console.log('🚀 Claiming estimated returns:', estimatedReturn);
      
      // Show loading message
      toast.loading("🔄 Claiming your returns from the liquidity pool...", { duration: 3000 });
      
      // Call the collect returns function
      await collectReturns();
      
      // Update last claim time
      const now = new Date();
      setLastClaimTime(now);
      localStorage.setItem('lastClaimTime', now.toISOString());
      
      // Calculate next claim time
      const nextClaim = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
      setNextClaimTime(nextClaim);
      
      console.log('✅ Returns claimed successfully');
      toast.success(
        `🎉 Successfully claimed ${estimatedReturn.toFixed(2)} PYUSD in returns!`,
        { duration: 5000 }
      );
      
    } catch (error: any) {
      console.error("Error claiming returns:", error);
      
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('Insufficient')) {
        toast.error("❌ Insufficient returns available to claim.");
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        toast.error("❌ Transaction was cancelled by user.");
      } else {
        toast.error(`❌ Failed to claim returns: ${errorMessage}`);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!nextClaimTime) return "Calculating...";
    
    const now = new Date();
    const timeDiff = nextClaimTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Available now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Card className="minimal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img 
            src="/PYUSD-token.png" 
            alt="PYUSD" 
            className="w-6 h-6 rounded-full"
          />
          <TrendingUp className="h-5 w-5 text-green-600" />
          Estimated Returns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Liquidity Display */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Available Liquidity</span>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {availableLiquidity.toFixed(2)} PYUSD
            </Badge>
          </div>
        </div>

        {/* Return Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800">

            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {estimatedReturn.toFixed(2)} PYUSD
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Based on current liquidity
            </div>
          </div>


        </div>

        {/* Claim Information */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Claim Schedule</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-700 dark:text-amber-300">Next Claim Available:</span>
              <Badge variant={canClaim() ? "default" : "outline"} className={canClaim() ? "bg-green-100 text-green-800" : ""}>
                {canClaim() ? "Available Now" : formatTimeRemaining()}
              </Badge>
            </div>
            {lastClaimTime && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-300">Last Claimed:</span>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {lastClaimTime.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Claim Button */}
        <div className="pt-4">
          <Button
            onClick={handleClaimReturns}
            disabled={!canClaim() || estimatedReturn <= 0 || isClaiming}
            className="w-full minimal-button paypal-primary shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isClaiming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Claiming Returns...
              </>
            ) : !canClaim() ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Claim Available in {formatTimeRemaining()}
              </>
            ) : estimatedReturn <= 0 ? (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                No Returns Available
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Claim {estimatedReturn.toFixed(2)} PYUSD
              </>
            )}
          </Button>
        </div>

        {/* Information Note */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Returns are calculated as 2.5% of available liquidity</p>
          <p>• Claims are available every 3 months</p>
          <p>• Returns are distributed from customer payment fees</p>
          <p>• Higher liquidity = higher returns for all investors</p>
        </div>
      </CardContent>
    </Card>
  );
}
