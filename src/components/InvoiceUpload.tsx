import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, DollarSign, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { extractInvoiceData, ExtractedInvoiceData } from "@/lib/invoiceParser";
import { isContractDeployed } from "@/config/contract";
import { useAccount } from "wagmi";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";
import { downloadSampleInvoice } from "@/lib/sampleInvoiceGenerator";
import ENSAddressInput from "./ENSAddressInput";
import { useInvoiceFactorPricing } from "@/hooks/usePythPrices";
import { RefreshCw } from "lucide-react";
import { useInvoiceFactoring } from "@/hooks/invoiceFactoring";

interface InvoiceUploadProps {
  onQuoteGenerated?: (quoteData: {
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  }, invoiceAmount: string) => void;
  onAcceptQuote?: () => void;
  onResetQuote?: () => void;
  isProcessing?: boolean;
}

interface InvoiceData {
  amount: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  description: string;
  file?: File;
}

export default function InvoiceUpload({ onQuoteGenerated, onAcceptQuote, onResetQuote }: InvoiceUploadProps) {
  const { address } = useAccount();
  const { user } = useSupabaseAuth();
  const { createInvoice, uploadPDF, createInvoiceFactoring } = useInvoices(user?.id);
  const { getFactorQuote, pyusdPrice, loading: priceLoading, lastUpdate, refresh, error } = useInvoiceFactorPricing();
  const { createFactoredInvoice } = useInvoiceFactoring();
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    amount: "",
    dueDate: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    description: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ExtractedInvoiceData | null>(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [quoteData, setQuoteData] = useState<{
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  } | null>(null);
  const [resolvedCustomerAddress, setResolvedCustomerAddress] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setInvoiceData(prev => ({ ...prev, file }));
      
      // Auto-parse the PDF and store in database
      setIsParsing(true);
      setParseProgress(0);
      
      try {
        // Simulate progress for parsing (0-50%)
        const progressInterval = setInterval(() => {
          setParseProgress(prev => Math.min(prev + 5, 50));
        }, 200);
        
        const extracted = await extractInvoiceData(file);
        
        clearInterval(progressInterval);
        setParseProgress(50);
        
        // Store PDF in database if user is authenticated
        let pdfUrl = "";
        if (user) {
          try {
            // Simulate progress for database storage (50-90%)
            const storageInterval = setInterval(() => {
              setParseProgress(prev => Math.min(prev + 5, 90));
            }, 100);
            
            // Upload PDF to Supabase Storage
            pdfUrl = await uploadPDF(file, user.id);
            console.log('PDF stored in Supabase Storage:', pdfUrl);
            
            // Create a database record to track the PDF
            const invoiceRecord = await createInvoice({
              user_id: user.id,
              invoice_number: extracted.invoiceNumber || `INV-${Date.now()}`,
              amount: parseFloat(extracted.amount || '0'),
              due_date: extracted.dueDate || new Date().toISOString().split('T')[0],
              customer_name: extracted.customerName || 'Unknown Customer',
              customer_email: extracted.customerEmail || 'unknown@example.com',
              customer_address: resolvedCustomerAddress || '',
              customer_ens_name: invoiceData.customerAddress.includes('.eth') ? invoiceData.customerAddress : undefined,
              description: extracted.description || 'PDF Invoice Upload',
              pdf_url: pdfUrl,
              pdf_filename: file.name,
              status: 'created'
            });
            
            console.log('Invoice record created in database:', invoiceRecord);
            
            clearInterval(storageInterval);
            setParseProgress(90);
          } catch (error) {
            console.error('Failed to store PDF in database:', error);
            toast.error("PDF parsing successful, but failed to store in database. You can still proceed.");
          }
        } else {
          console.log('User not authenticated, skipping PDF storage');
        }
        
        setParseProgress(100);
        setParsedData(extracted);
        
        // Auto-fill form with extracted data (always try to fill if any data is available)
        const hasAnyData = extracted.amount || extracted.dueDate || extracted.customerName || 
                          extracted.customerEmail || extracted.description || extracted.invoiceNumber;
        
        if (hasAnyData) {
          setInvoiceData(prev => ({
            ...prev,
            amount: extracted.amount || prev.amount,
            dueDate: extracted.dueDate || prev.dueDate,
            customerName: extracted.customerName || prev.customerName,
            customerEmail: extracted.customerEmail || prev.customerEmail,
            description: extracted.description || prev.description,
          }));
          
          if (extracted.confidence > 70) {
            toast.success(`Invoice parsed and stored successfully! (${extracted.confidence}% confidence)`);
          } else if (extracted.confidence > 30) {
            toast.success(`Invoice parsed and stored with good confidence! (${extracted.confidence}% confidence)`);
          } else if (extracted.confidence > 0) {
            toast.error(`Some data extracted (${extracted.confidence}% confidence). Please verify and complete manually.`);
          } else {
            toast.error("Limited data extracted. Please verify and complete manually.");
          }
        } else {
          toast.error("No data could be extracted from the PDF. Please enter data manually.");
        }
      } catch (error) {
        toast.error("Failed to parse PDF. Please fill in the form manually.");
      } finally {
        setIsParsing(false);
        setTimeout(() => setParseProgress(0), 1000);
      }
    } else if (file) {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualParse = async () => {
    if (!invoiceData.file) {
      toast.error("Please select a PDF file first");
      return;
    }
    
    setIsParsing(true);
    setParseProgress(0);
    
    try {
      // Simulate progress for parsing (0-50%)
      const progressInterval = setInterval(() => {
        setParseProgress(prev => Math.min(prev + 5, 50));
      }, 200);
      
      const extracted = await extractInvoiceData(invoiceData.file);
      
      clearInterval(progressInterval);
      setParseProgress(50);
      
      // Store PDF in database if user is authenticated
      let pdfUrl = "";
      if (user) {
        try {
          // Simulate progress for database storage (50-90%)
          const storageInterval = setInterval(() => {
            setParseProgress(prev => Math.min(prev + 5, 90));
          }, 100);
          
          // Upload PDF to Supabase Storage
          pdfUrl = await uploadPDF(invoiceData.file, user.id);
          console.log('PDF stored in Supabase Storage:', pdfUrl);
          
          // Create a database record to track the PDF
          const invoiceRecord = await createInvoice({
            user_id: user.id,
            invoice_number: extracted.invoiceNumber || `INV-${Date.now()}`,
            amount: parseFloat(extracted.amount || '0'),
            due_date: extracted.dueDate || new Date().toISOString().split('T')[0],
            customer_name: extracted.customerName || 'Unknown Customer',
            customer_email: extracted.customerEmail || 'unknown@example.com',
            customer_address: resolvedCustomerAddress || '',
            customer_ens_name: invoiceData.customerAddress.includes('.eth') ? invoiceData.customerAddress : undefined,
            description: extracted.description || 'PDF Invoice Upload',
            pdf_url: pdfUrl,
            pdf_filename: invoiceData.file.name,
            status: 'created'
          });
          
          console.log('Invoice record created in database:', invoiceRecord);
          
          clearInterval(storageInterval);
          setParseProgress(90);
        } catch (error) {
          console.error('Failed to store PDF in database:', error);
          toast.error("PDF parsing successful, but failed to store in database. You can still proceed.");
        }
      } else {
        console.log('User not authenticated, skipping PDF storage');
      }
      
      setParseProgress(100);
      setParsedData(extracted);
      
      // Auto-fill form with extracted data (always try to fill if any data is available)
      const hasAnyData = extracted.amount || extracted.dueDate || extracted.customerName || 
                        extracted.customerEmail || extracted.description || extracted.invoiceNumber;
      
      if (hasAnyData) {
        setInvoiceData(prev => ({
          ...prev,
          amount: extracted.amount || prev.amount,
          dueDate: extracted.dueDate || prev.dueDate,
          customerName: extracted.customerName || prev.customerName,
          customerEmail: extracted.customerEmail || prev.customerEmail,
          description: extracted.description || prev.description,
        }));
        
        if (extracted.confidence > 70) {
          toast.success(`Invoice parsed and stored successfully! (${extracted.confidence}% confidence)`);
        } else if (extracted.confidence > 30) {
          toast.success(`Invoice parsed and stored with good confidence! (${extracted.confidence}% confidence)`);
        } else if (extracted.confidence > 0) {
          toast.error(`Some data extracted (${extracted.confidence}% confidence). Please verify and complete manually.`);
        } else {
          toast.error("Limited data extracted. Please verify and complete manually.");
        }
      } else {
        toast.error("No data could be extracted from the PDF. Please enter data manually.");
      }
    } catch (error) {
      toast.error("Failed to parse PDF. Please fill in the form manually.");
    } finally {
      setIsParsing(false);
      setTimeout(() => setParseProgress(0), 1000);
    }
  };

  const handleGetQuote = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isContractDeployed()) {
      toast.error("Smart contract not deployed yet. Please deploy the contract first.");
      return;
    }

    if (!invoiceData.amount || !invoiceData.dueDate || !invoiceData.customerName || !invoiceData.customerAddress || !invoiceData.description) {
      toast.error("Please fill in all required fields including customer address");
      return;
    }

    if (!resolvedCustomerAddress) {
      toast.error("Please resolve the customer address or ENS name first");
      return;
    }

    setIsGettingQuote(true);
    
    try {
      const invoiceAmountUSD = parseFloat(invoiceData.amount);
      
      // Get real-time pricing from Pyth
      const priceQuote = getFactorQuote(invoiceAmountUSD, 0.8); // 80% factor rate
      
      const quote = {
        factorAmount: priceQuote.factorAmount.toFixed(2),
        fee: priceQuote.fee.toFixed(2),
        netAmount: priceQuote.netAmount.toFixed(2),
        dueDate: invoiceData.dueDate,
      };
      
      setQuoteData(quote);
      onQuoteGenerated?.(quote, invoiceData.amount);
      
      // Show success message with price feed info
      if (priceQuote.isLive) {
        toast.success(`Quote generated with live Pyth prices! PYUSD rate: $${priceQuote.pyusdRate.toFixed(4)}`);
      } else {
        toast.success("Quote generated! (Using fallback pricing - Pyth unavailable)");
      }
      
    } catch (error: any) {
      console.error("Error getting quote:", error);
      toast.error("Failed to generate quote. Please try again.");
    } finally {
      setIsGettingQuote(false);
    }
  };

  const [isProcessingQuote, setIsProcessingQuote] = useState(false);

  const handleAcceptQuote = async () => {
    if (!address || !quoteData || !user) {
      toast.error("Please connect your wallet and get a quote first");
      return;
    }
    
    setIsProcessingQuote(true);
    console.log('🚀 Starting handleAcceptQuote...');
    
    try {
      // FIRST: Create factored invoice on blockchain
      console.log('🔗 Step 1: Creating factored invoice on blockchain...');
      const transactionHash = await createFactoredInvoice({
        customer: resolvedCustomerAddress || '',
        amount: invoiceData.amount,
        dueDate: invoiceData.dueDate,
        description: invoiceData.description,
      });

      console.log('✅ Blockchain transaction successful:', transactionHash);
      toast.success(`🎉 PYUSD received! Transaction: ${transactionHash.slice(0, 10)}...`);

      // SECOND: Save to database (optional, don't fail if this doesn't work)
      console.log('💾 Step 2: Saving to database...');
      let savedInvoice = null;
      
      try {
        // Upload PDF to Supabase if file exists
        let pdfUrl = "";
        if (invoiceData.file) {
          pdfUrl = await uploadPDF(invoiceData.file, user.id);
        }

        // Save invoice to Supabase
        savedInvoice = await createInvoice({
          user_id: user.id,
          invoice_number: parsedData?.invoiceNumber || `INV-${Date.now()}`,
          amount: parseFloat(invoiceData.amount),
          due_date: invoiceData.dueDate,
          customer_name: invoiceData.customerName,
          customer_email: invoiceData.customerEmail,
          customer_address: resolvedCustomerAddress || '',
          customer_ens_name: invoiceData.customerAddress.includes('.eth') ? invoiceData.customerAddress : undefined,
          description: invoiceData.description,
          pdf_url: pdfUrl,
          pdf_filename: invoiceData.file?.name,
          status: 'factored'
        });

        // Create invoice factoring record
        await createInvoiceFactoring({
          invoice_id: savedInvoice.id,
          user_id: user.id,
          factor_amount: parseFloat(quoteData.factorAmount),
          factor_fee: parseFloat(quoteData.fee),
          net_amount: parseFloat(quoteData.netAmount),
          status: 'completed'
        });

        console.log('✅ Database save successful');
        
      } catch (dbError) {
        console.error('⚠️ Database save failed (but blockchain transaction succeeded):', dbError);
        toast.error("⚠️ PYUSD was transferred but failed to save to database.");
      }

      // Wait a moment and show final confirmation
      setTimeout(() => {
        console.log('🔍 Transaction completed successfully!');
        toast.success('💰 Check your wallet - PYUSD has been transferred!');
      }, 3000);

      // Only reset form on successful transaction
      setInvoiceData({
        amount: "",
        dueDate: "",
        customerName: "",
        customerEmail: "",
        customerAddress: "",
        description: "",
      });
      setParsedData(null);
      setQuoteData(null);
      setResolvedCustomerAddress(null);

      // Call the parent's accept quote handler
      onAcceptQuote?.();

      // Reset the parent's quote data
      onResetQuote?.();
    } catch (error: any) {
      console.error("Error in quote acceptance:", error);
      const errorMessage = error?.message || "Failed to process quote. Please try again.";
      toast.error(`❌ Transaction failed: ${errorMessage}`);
    } finally {
      setIsProcessingQuote(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's a PDF file, process it
    if (invoiceData.file) {
      await handleManualParse();
      return;
    }
    
    // If no file, just validate the form
    if (!invoiceData.amount || !invoiceData.dueDate || !invoiceData.customerName || !invoiceData.customerEmail || !invoiceData.customerAddress) {
      toast.error("Please fill in all required fields including customer address or upload a PDF file");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload process for manual entry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Invoice data ready! You can now create it on the blockchain.");
    } catch (error) {
      toast.error("Failed to process invoice data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='minimal-card space-y-12'>
      <div className='text-center space-y-4'>
        <h2 className='text-4xl font-bold text-foreground'>
          Upload Your Invoice
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Upload a PDF invoice and we'll automatically extract all the details for you
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* PDF Upload Section - Priority */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Label htmlFor='file' className='text-xl font-medium text-foreground'>
              📄 Upload Invoice PDF
            </Label>
            <div className="flex flex-col items-center gap-4">
              <Input
                type='file'
                id='file'
                accept='.pdf'
                onChange={handleFileChange}
                disabled={isParsing}
                className="minimal-input max-w-md"
              />
              {invoiceData.file && !isParsing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleManualParse}
                  className="minimal-button"
                >
                  Parse Again
                </Button>
              )}
            </div>
            <p className='text-sm text-muted-foreground'>
              Upload a PDF invoice to automatically extract all information
            </p>
            
            {/* Sample PDF Link */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Need a sample? Try our demo invoice:</p>
              <Button
                type="button"
                variant="outline"
                onClick={downloadSampleInvoice}
                className="minimal-button"
              >
                📥 Download Sample Invoice
              </Button>
            </div>
          </div>
          
          {/* Parsing Status */}
          {isParsing && (
            <div className="space-y-4 p-6 bg-primary/5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-lg font-medium text-primary">
                  Parsing PDF...
                </span>
              </div>
              <Progress value={parseProgress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">
                Extracting invoice data...
              </p>
            </div>
          )}
          
          {/* Parsing Results */}
          {parsedData && !isParsing && (
            <div className={`space-y-4 p-6 rounded-2xl ${
              parsedData.confidence > 0 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {parsedData.confidence > 0 ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <span className={`text-lg font-medium ${
                  parsedData.confidence > 0 
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {parsedData.confidence > 0 ? 'PDF Parsed Successfully!' : 'PDF Parsing Failed'}
                </span>
                {parsedData.confidence > 0 && (
                  <Badge variant={parsedData.confidence > 70 ? "default" : "secondary"} className="text-sm">
                    {parsedData.confidence}% confidence
                  </Badge>
                )}
              </div>
              {parsedData.confidence > 0 ? (
                <div className="text-sm text-green-700 dark:text-green-300 space-y-2 text-center">
                  {parsedData.amount && <p>✅ Amount: ${parsedData.amount}</p>}
                  {parsedData.dueDate && <p>✅ Due Date: {parsedData.dueDate}</p>}
                  {parsedData.customerName && <p>✅ Customer: {parsedData.customerName}</p>}
                  {parsedData.customerEmail && <p>✅ Email: {parsedData.customerEmail}</p>}
                  {parsedData.invoiceNumber && <p>✅ Invoice #: {parsedData.invoiceNumber}</p>}
                </div>
              ) : (
                <div className="text-sm text-red-700 dark:text-red-300 text-center">
                  <p>❌ {parsedData.description}</p>
                  <p>Please try uploading a different PDF or enter data manually below.</p>
                </div>
              )}
              {parsedData.confidence > 0 && parsedData.confidence < 50 && (
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Please verify the extracted data below</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Fields - Auto-filled from PDF */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Invoice Details</h3>
            <p className="text-muted-foreground">
              {parsedData && parsedData.confidence > 0 
                ? "Review and edit the extracted information below" 
                : "Enter your invoice details manually"}
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className="space-y-3">
              <Label htmlFor='amount' className='text-base font-medium text-foreground'>
              Invoice Amount (USD) *
              </Label>
              <Input
              type='number'
              id='amount'
              value={invoiceData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder='10000'
              step='0.01'
              min='0'
              required
                className='minimal-input'
            />
          </div>
          
            <div className="space-y-3">
              <Label htmlFor='dueDate' className='text-base font-medium text-foreground'>
              Due Date *
              </Label>
              <Input
              type='date'
              id='dueDate'
              value={invoiceData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              required
                className='minimal-input'
            />
          </div>
        </div>
        
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className="space-y-3">
              <Label htmlFor='customerName' className='text-base font-medium text-foreground'>
              Customer Name *
              </Label>
              <Input
              type='text'
              id='customerName'
              value={invoiceData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder='Acme Corp'
              required
                className='minimal-input'
            />
          </div>
          
            <div className="space-y-3">
              <Label htmlFor='customerEmail' className='text-base font-medium text-foreground'>
              Customer Email *
              </Label>
              <Input
              type='email'
              id='customerEmail'
              value={invoiceData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              placeholder='billing@acme.com'
              required
                className='minimal-input'
            />
          </div>
        </div>
        
        {/* Customer Address/ENS Input */}
        <ENSAddressInput
          label="Customer Wallet Address or ENS Name"
          placeholder="0x... or alice.eth"
          value={invoiceData.customerAddress}
          onChange={(value) => handleInputChange('customerAddress', value)}
          onAddressResolved={setResolvedCustomerAddress}
          required={true}
        />
        
          <div className="space-y-3">
            <Label htmlFor='description' className='text-base font-medium text-foreground'>
            Description
            </Label>
            <Textarea
            id='description'
            value={invoiceData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder='Services rendered, products delivered, etc.'
              rows={4}
              className='minimal-input'
          />
        </div>
        </div>
        
        <div className="flex flex-col gap-6 pt-8">
          <Button
          type='submit'
          disabled={isUploading}
            className='minimal-button w-full bg-primary text-primary-foreground hover:bg-primary/90'
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-3" />
                {invoiceData.file ? "Process PDF" : "Validate Form"}
              </>
            )}
          </Button>
          
          {/* Enhanced Pyth Price Feed Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${priceLoading ? 'bg-yellow-500 animate-pulse' : pyusdPrice ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Pyth Price Feed
                  </span>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Real-time market data
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {priceLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-blue-200 dark:bg-blue-700 h-4 w-16 rounded"></div>
                      <span className="text-xs text-blue-600 dark:text-blue-400">Loading...</span>
                    </div>
                  ) : pyusdPrice ? (
                    <div className="text-sm">
                      <span className="font-bold text-green-700 dark:text-green-300">
                        PYUSD: ${pyusdPrice.toFixed(6)}
                      </span>
                      {lastUpdate && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {lastUpdate.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">
                      <span className="text-red-600 dark:text-red-400 font-medium">Offline</span>
                      <div className="text-xs text-red-500 dark:text-red-400">Using fallback</div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refresh}
                  disabled={priceLoading}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                >
                  <RefreshCw className={`h-4 w-4 ${priceLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                ⚠️ {error} - Using fallback pricing
              </div>
            )}
          </div>

          <Button
            type='button'
            onClick={handleGetQuote}
            disabled={isGettingQuote || !address || !isContractDeployed()}
            className='minimal-button w-full bg-secondary text-secondary-foreground hover:bg-secondary/80'
            size="lg"
          >
            {isGettingQuote ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Getting Quote with Live Prices...
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5 mr-3" />
                Get Factoring Quote {pyusdPrice ? '(Live Prices)' : '(Fallback)'}
              </>
            )}
          </Button>
          
          {!address && (
            <p className="text-sm text-muted-foreground text-center">
              Connect your wallet to get factoring quotes
            </p>
          )}
          
          {address && !isContractDeployed() && (
            <div className="p-6 bg-muted rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium text-foreground">
                  Contract Not Deployed
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Please deploy the smart contract first. Check the deployment guide in the contracts folder.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
