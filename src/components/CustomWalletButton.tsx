import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useToken, useTokenBalance } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  LogOut, 
  Copy, 
  ExternalLink,
  DollarSign,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);
  const paymentTokenBalance = useTokenBalance(paymentTokenAddress, address);
  const [showMenu, setShowMenu] = useState(false);

  // Check if we're on the correct network (ETH Sepolia)
  const isCorrectNetwork = chain?.id === 11155111; // ETH Sepolia chain ID

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
      setShowMenu(false);
    }
  };

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
      setShowMenu(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
  };

  if (!isConnected) {
    return <ConnectButton />;
  }

  const formattedBalance = paymentTokenBalance.data && paymentToken.data
    ? formatUnits(paymentTokenBalance.data, paymentToken.data.decimals)
    : '0';

  const displayBalance = parseFloat(formattedBalance).toFixed(2);


  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="minimal-button flex items-center gap-2 px-4 py-2"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <div className="flex items-center gap-1">
                {!isCorrectNetwork ? (
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                ) : (
                  <DollarSign className="h-3 w-3 text-green-600" />
                )}
                <span className={`text-sm font-medium ${
                  !isCorrectNetwork ? 'text-red-600' : 'text-green-600'
                }`}>
                  {!isCorrectNetwork ? (
                    "Wrong Network"
                  ) : paymentTokenBalance.isLoading ? (
                    "Loading..."
                  ) : paymentTokenBalance.error ? (
                    "Error"
                  ) : (
                    `${displayBalance} PYUSD`
                  )}
                </span>
              </div>
            </div>
          <ChevronDown className="h-3 w-3" />
        </div>
      </Button>
      
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">Wallet</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {address}
            </p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">PYUSD Balance</span>
              </div>
              <Badge variant="secondary" className="text-green-600">
                {paymentTokenBalance.isLoading ? (
                  "Loading..."
                ) : paymentTokenBalance.error ? (
                  "Error"
                ) : (
                  `${displayBalance} PYUSD`
                )}
              </Badge>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          
          <div className="p-1">
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              Copy Address
            </button>
            
            <button
              onClick={handleViewOnExplorer}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
