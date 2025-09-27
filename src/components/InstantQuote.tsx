import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, CheckCircle, Loader2, DollarSign, Calendar, Shield, Percent } from "lucide-react";

interface QuoteData {
  invoiceAmount: number;
  offerAmount: number;
  discountRate: number;
  processingFee: number;
  netAmount: number;
  dueDate: string;
  riskScore: string;
  status: 'calculating' | 'ready' | 'error';
}

export default function InstantQuote() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate getting a quote when component mounts
  useEffect(() => {
    const calculateQuote = async () => {
      setIsCalculating(true);
      setProgress(0);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      
      // Mock quote calculation
      const invoiceAmount = 10000; // Example amount
      const discountRate = 0.02; // 2% per month
      const processingFee = 0.005; // 0.5% processing fee
      const monthsToDue = 1; // Assume 1 month to due date
      
      const discountAmount = invoiceAmount * discountRate * monthsToDue;
      const feeAmount = invoiceAmount * processingFee;
      const netAmount = invoiceAmount - discountAmount - feeAmount;
      
      setQuoteData({
        invoiceAmount,
        offerAmount: netAmount,
        discountRate: discountRate * 100,
        processingFee: processingFee * 100,
        netAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        riskScore: 'Low',
        status: 'ready'
      });
      
      setIsCalculating(false);
    };

    calculateQuote();
  }, []);

  if (isCalculating) {
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
          <div className='text-center py-8 space-y-4'>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className='text-sm text-muted-foreground'>{progress}% Complete</p>
            </div>
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div>
              <p className='text-foreground font-medium'>Calculating your instant quote...</p>
              <p className='text-sm text-muted-foreground mt-1'>
                Analyzing invoice details and risk factors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quoteData) {
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
            <p className='text-muted-foreground'>Upload an invoice to get your instant quote</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              ${quoteData.offerAmount.toLocaleString()} PYUSD
            </p>
            <p className='text-sm text-muted-foreground'>
              for your ${quoteData.invoiceAmount.toLocaleString()} invoice
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
              <span className='font-semibold'>${quoteData.invoiceAmount.toLocaleString()}</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Discount Rate</span>
              </div>
              <span className='font-semibold'>{quoteData.discountRate}%</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Processing Fee</span>
              </div>
              <span className='font-semibold'>{quoteData.processingFee}%</span>
            </div>
          </div>
          
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Due Date</span>
              </div>
              <span className='font-semibold'>{new Date(quoteData.dueDate).toLocaleDateString()}</span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className='text-sm font-medium'>Risk Score</span>
              </div>
              <Badge variant={quoteData.riskScore === 'Low' ? 'default' : 'secondary'}>
                {quoteData.riskScore}
              </Badge>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20'>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className='text-sm font-medium text-primary'>Net Amount</span>
              </div>
              <span className='font-bold text-lg text-primary'>${quoteData.netAmount.toLocaleString()}</span>
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
              <span>You receive ${quoteData.offerAmount.toLocaleString()} PYUSD immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>We collect the full ${quoteData.invoiceAmount.toLocaleString()} from your customer</span>
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
      </CardContent>
    </Card>
  );
}
