import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  Wallet,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceNumber: string;
  paymentAmount: number;
  isLoading?: boolean;
}

export default function PaymentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  invoiceNumber,
  paymentAmount,
  isLoading = false
}: PaymentConfirmationDialogProps) {
  // Fee calculations
  const totalFeePercent = 5; // 5% total fee
  const cashbackPercent = 2.5; // 2.5% cashback
  const lpFeePercent = totalFeePercent - cashbackPercent; // 2.5% to LP
  
  const totalFee = (paymentAmount * totalFeePercent) / 100;
  const cashback = (paymentAmount * cashbackPercent) / 100;
  const lpFee = (paymentAmount * lpFeePercent) / 100;
  const netPayment = paymentAmount - totalFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <img 
              src="/PYUSD-token.png" 
              alt="PYUSD" 
              className="w-6 h-6 rounded-full"
            />
            <Calculator className="h-5 w-5 text-blue-600" />
            Payment Confirmation
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review the fee breakdown before confirming your payment for Invoice #{invoiceNumber}
          </p>

        <div className="space-y-4">
          {/* Payment Amount */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Payment Amount</span>
              </div>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {paymentAmount} PYUSD
              </span>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Fee Breakdown (5% Total)
            </h4>
            
            <div className="space-y-2">
              {/* Total Fee */}
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Total Fee (5%)</span>
                </div>
                <Badge variant="outline" className="text-amber-700 border-amber-300">
                  -{totalFee.toFixed(2)} PYUSD
                </Badge>
              </div>

              {/* Cashback */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Your Cashback (2.5%)</span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  +{cashback.toFixed(2)} PYUSD
                </Badge>
              </div>

              {/* LP Fee */}
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Liquidity Pool (2.5%)</span>
                </div>
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  {lpFee.toFixed(2)} PYUSD
                </Badge>
              </div>
            </div>
          </div>

          {/* Net Payment */}
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Net Payment to Invoice</span>
              </div>
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {netPayment.toFixed(2)} PYUSD
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• You pay {paymentAmount} PYUSD total</p>
            <p>• You receive {cashback.toFixed(2)} PYUSD cashback</p>
            <p>• {netPayment.toFixed(2)} PYUSD goes to settle the invoice</p>
            <p>• {lpFee.toFixed(2)} PYUSD goes to liquidity pool</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 minimal-button paypal-primary shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
