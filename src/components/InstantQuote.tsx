import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle, Loader2, DollarSign, Calendar, Shield, Percent } from "lucide-react";

interface InstantQuoteProps {
  quoteData?: {
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  } | null;
  invoiceAmount?: string;
  onAcceptQuote?: () => void;
  isProcessing?: boolean;
}

export default function InstantQuote({ quoteData: propQuoteData, invoiceAmount, onAcceptQuote, isProcessing }: InstantQuoteProps) {

  // Only show quote if real data is provided
  if (!propQuoteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className='w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              2
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Get Instant Quote
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>Upload an invoice and click "Get Factoring Quote" to see your instant quote</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert prop data to display format
  const displayQuoteData = {
    invoiceAmount: parseFloat(invoiceAmount || '0'),
    offerAmount: parseFloat(propQuoteData.factorAmount),
    discountRate: 2, // 2% fee
    processingFee: 0, // No additional processing fee
    netAmount: parseFloat(propQuoteData.netAmount),
    dueDate: propQuoteData.dueDate,
    riskScore: 'Low',
    status: 'ready' as const
  };

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            <CheckCircle className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Your Instant Quote
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800'>
          <div className='text-center space-y-2'>
            <p className='text-sm text-muted-foreground'>We'll pay you</p>
            <p className='text-4xl font-bold text-green-600 dark:text-green-400'>
              ${displayQuoteData.offerAmount.toLocaleString()} PYUSD
            </p>
            <p className='text-sm text-muted-foreground'>
              for your ${displayQuoteData.invoiceAmount.toLocaleString()} invoice
            </p>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Invoice Amount</span>
              </div>
              <span className='font-semibold'>${displayQuoteData.invoiceAmount.toLocaleString()}</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Factoring Fee</span>
              </div>
              <span className='font-semibold'>{displayQuoteData.discountRate}%</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Advance Amount</span>
              </div>
              <span className='font-semibold'>${displayQuoteData.offerAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Due Date</span>
              </div>
              <span className='font-semibold'>{new Date(displayQuoteData.dueDate).toLocaleDateString()}</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Risk Score</span>
              </div>
              <Badge variant={displayQuoteData.riskScore === 'Low' ? 'default' : 'secondary'}>
                {displayQuoteData.riskScore}
              </Badge>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20'>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className='text-sm font-medium text-primary'>Net Amount</span>
              </div>
              <span className='font-bold text-lg text-primary'>${displayQuoteData.netAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2'>
            <CheckCircle className="h-4 w-4" />
            How it works:
          </h4>
          <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-2'>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>You receive ${displayQuoteData.offerAmount.toLocaleString()} PYUSD immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>We collect the full ${displayQuoteData.invoiceAmount.toLocaleString()} from your customer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>No hidden fees or surprises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Funds available in your wallet instantly</span>
            </li>
          </ul>
        </div>

        {propQuoteData && onAcceptQuote && (
          <Button
            onClick={onAcceptQuote}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Storing Invoice & Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Quote & Get PYUSD
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
