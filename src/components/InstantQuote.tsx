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
      <div className='minimal-card text-center space-y-8'>
        <div className='space-y-4'>
          <h2 className='text-4xl font-bold text-foreground'>
            Your Quote
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Upload an invoice and click "Get Factoring Quote" to see your instant quote
          </p>
        </div>
      </div>
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
    <div className='minimal-card space-y-12'>
      <div className='text-center space-y-4'>
        <h2 className='text-4xl font-bold text-foreground'>
          Your Instant Quote
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Here's what we'll pay you for your invoice
        </p>
      </div>

      <div className='bg-primary/5 p-12 rounded-3xl text-center space-y-6'>
        <div className='space-y-4'>
          <p className='text-lg text-muted-foreground'>We'll pay you</p>
          <p className='text-6xl font-bold text-primary'>
            ${displayQuoteData.offerAmount.toLocaleString()}
          </p>
          <p className='text-lg text-muted-foreground'>
            for your ${displayQuoteData.invoiceAmount.toLocaleString()} invoice
          </p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
            <span className='text-base font-medium text-foreground'>Invoice Amount</span>
            <span className='text-xl font-bold text-foreground'>${displayQuoteData.invoiceAmount.toLocaleString()}</span>
          </div>
          
          <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
            <span className='text-base font-medium text-foreground'>Factoring Fee</span>
            <span className='text-xl font-bold text-foreground'>{displayQuoteData.discountRate}%</span>
          </div>
          
          <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
            <span className='text-base font-medium text-foreground'>Advance Amount</span>
            <span className='text-xl font-bold text-foreground'>${displayQuoteData.offerAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className='space-y-6'>
          <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
            <span className='text-base font-medium text-foreground'>Due Date</span>
            <span className='text-xl font-bold text-foreground'>{new Date(displayQuoteData.dueDate).toLocaleDateString()}</span>
          </div>
          
          <div className='flex items-center justify-between p-6 bg-muted rounded-2xl'>
            <span className='text-base font-medium text-foreground'>Risk Score</span>
            <Badge variant={displayQuoteData.riskScore === 'Low' ? 'default' : 'secondary'} className='text-base px-4 py-2'>
              {displayQuoteData.riskScore}
            </Badge>
          </div>
          
          <div className='flex items-center justify-between p-6 bg-primary/10 rounded-2xl'>
            <span className='text-base font-medium text-primary'>Net Amount</span>
            <span className='text-2xl font-bold text-primary'>${displayQuoteData.netAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className='bg-muted p-8 rounded-3xl space-y-6'>
        <h3 className='text-2xl font-bold text-foreground text-center'>
          How it works
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>1</div>
              <div>
                <p className='font-medium text-foreground'>You receive PYUSD immediately</p>
                <p className='text-sm text-muted-foreground'>${displayQuoteData.offerAmount.toLocaleString()} in your wallet</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>2</div>
              <div>
                <p className='font-medium text-foreground'>We collect from your customer</p>
                <p className='text-sm text-muted-foreground'>Full ${displayQuoteData.invoiceAmount.toLocaleString()} amount</p>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>3</div>
              <div>
                <p className='font-medium text-foreground'>No hidden fees</p>
                <p className='text-sm text-muted-foreground'>Transparent pricing</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5'>4</div>
              <div>
                <p className='font-medium text-foreground'>Instant settlement</p>
                <p className='text-sm text-muted-foreground'>Funds available immediately</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {propQuoteData && onAcceptQuote && (
        <Button
          onClick={onAcceptQuote}
          disabled={isProcessing}
          className="minimal-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              Storing Invoice & Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-3" />
              Accept Quote & Get PYUSD
            </>
          )}
        </Button>
      )}
    </div>
  );
}
