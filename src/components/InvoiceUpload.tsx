import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, DollarSign, Calendar, User, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { extractInvoiceData, ExtractedInvoiceData } from "@/lib/invoiceParser";
import { useInvoiceFactoring } from "@/hooks/invoiceFactoring";
import { isContractDeployed } from "@/config/contract";
import { useAccount } from "wagmi";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";

interface InvoiceUploadProps {
  onQuoteGenerated?: (quoteData: {
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  }, invoiceAmount: string) => void;
  onAcceptQuote?: () => void;
  isProcessing?: boolean;
}

interface InvoiceData {
  amount: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  description: string;
  file?: File;
}

export default function InvoiceUpload({ onQuoteGenerated, onAcceptQuote }: InvoiceUploadProps) {
  const { address } = useAccount();
  const { createInvoiceFromData } = useInvoiceFactoring();
  const { user } = useSupabaseAuth();
  const { createInvoice, uploadPDF, createInvoiceFactoring } = useInvoices(user?.id);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    amount: "",
    dueDate: "",
    customerName: "",
    customerEmail: "",
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setInvoiceData(prev => ({ ...prev, file }));
      
      // Auto-parse the PDF
      setIsParsing(true);
      setParseProgress(0);
      
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setParseProgress(prev => Math.min(prev + 10, 90));
        }, 200);
        
        const extracted = await extractInvoiceData(file);
        
        clearInterval(progressInterval);
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
            toast.success(`Invoice parsed successfully! (${extracted.confidence}% confidence)`);
          } else if (extracted.confidence > 30) {
            toast.success(`Invoice parsed with good confidence! (${extracted.confidence}% confidence)`);
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
      const progressInterval = setInterval(() => {
        setParseProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const extracted = await extractInvoiceData(invoiceData.file);
      
      clearInterval(progressInterval);
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
          toast.success(`Invoice parsed successfully! (${extracted.confidence}% confidence)`);
        } else if (extracted.confidence > 30) {
          toast.success(`Invoice parsed with good confidence! (${extracted.confidence}% confidence)`);
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

    if (!invoiceData.amount || !invoiceData.dueDate || !invoiceData.customerName || !invoiceData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGettingQuote(true);
    
    try {
      // Calculate quote (80% advance, 2% fee)
      const amount = parseFloat(invoiceData.amount);
      const factorAmount = amount * 0.80; // 80% advance
      const fee = amount * 0.02; // 2% fee
      const netAmount = factorAmount - fee; // Net amount to business
      
      const quote = {
        factorAmount: factorAmount.toFixed(2),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
        dueDate: invoiceData.dueDate,
      };
      
      setQuoteData(quote);
      onQuoteGenerated?.(quote, invoiceData.amount);
      toast.success("Quote generated! Review the terms in the quote section below.");
      
    } catch (error: any) {
      console.error("Error getting quote:", error);
      toast.error("Failed to generate quote. Please try again.");
    } finally {
      setIsGettingQuote(false);
    }
  };

  const handleAcceptQuote = async () => {
    if (!address || !quoteData || !user) {
      toast.error("Please connect your wallet and get a quote first");
      return;
    }
    
    try {
      // Upload PDF to Supabase if file exists
      let pdfUrl = "";
      if (invoiceData.file) {
        pdfUrl = await uploadPDF(invoiceData.file, user.id);
      }

      // Save invoice to Supabase
      const savedInvoice = await createInvoice({
        user_id: user.id,
        invoice_number: parsedData?.invoiceNumber || `INV-${Date.now()}`,
        amount: parseFloat(invoiceData.amount),
        due_date: invoiceData.dueDate,
        customer_name: invoiceData.customerName,
        customer_email: invoiceData.customerEmail,
        description: invoiceData.description,
        pdf_url: pdfUrl,
        pdf_filename: invoiceData.file?.name,
        status: 'created'
      });

      // Create invoice factoring record
      await createInvoiceFactoring({
        invoice_id: savedInvoice.id,
        user_id: user.id,
        factor_amount: parseFloat(quoteData.factorAmount),
        factor_fee: parseFloat(quoteData.fee),
        net_amount: parseFloat(quoteData.netAmount),
        status: 'pending'
      });

      // For now, we'll use a placeholder customer address
      // In a real app, you'd need to resolve the customer email to an address
      const customerAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
      
      // Create invoice on blockchain and factor it
      const blockchainInvoiceId = await createInvoiceFromData({
        customer: customerAddress,
        amount: invoiceData.amount,
        dueDate: invoiceData.dueDate,
        description: invoiceData.description,
      });

      // Update invoice with blockchain ID
      await createInvoice({
        ...savedInvoice,
        blockchain_invoice_id: blockchainInvoiceId,
        status: 'factored'
      });

      toast.success("Invoice created and factored successfully! You'll receive PYUSD shortly.");
      
      // Reset form
      setInvoiceData({
        amount: "",
        dueDate: "",
        customerName: "",
        customerEmail: "",
        description: "",
      });
      setParsedData(null);
      setQuoteData(null);
      
      // Call the parent's accept quote handler
      onAcceptQuote?.();
    } catch (error: any) {
      console.error("Error accepting quote:", error);
      const errorMessage = error?.message || "Failed to accept quote. Please try again.";
      toast.error(errorMessage);
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
    if (!invoiceData.amount || !invoiceData.dueDate || !invoiceData.customerName || !invoiceData.customerEmail) {
      toast.error("Please fill in all required fields or upload a PDF file");
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
            1
          </div>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Invoice
          </div>
        </CardTitle>
        <p className='text-muted-foreground'>
          Upload your invoice PDF and provide customer details to get an instant quote
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="space-y-2">
              <Label htmlFor='amount' className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor='dueDate' className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date *
              </Label>
              <Input
                type='date'
                id='dueDate'
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="space-y-2">
              <Label htmlFor='customerName' className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Name *
              </Label>
              <Input
                type='text'
                id='customerName'
                value={invoiceData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder='Acme Corp'
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor='customerEmail' className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Customer Email *
              </Label>
              <Input
                type='email'
                id='customerEmail'
                value={invoiceData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder='billing@acme.com'
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor='description' className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id='description'
              value={invoiceData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder='Services rendered, products delivered, etc.'
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor='file' className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoice PDF (Auto-Parse)
            </Label>
            <div className="flex gap-2">
              <Input
                type='file'
                id='file'
                accept='.pdf'
                onChange={handleFileChange}
                disabled={isParsing}
                className="flex-1"
              />
              {invoiceData.file && !isParsing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleManualParse}
                  className="shrink-0"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Parse
                </Button>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              Upload your invoice PDF to automatically extract information
            </p>
            
            {/* Parsing Status */}
            {isParsing && (
              <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Parsing PDF...
                  </span>
                </div>
                <Progress value={parseProgress} className="w-full" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Extracting invoice data...
                </p>
              </div>
            )}
            
            {/* Parsing Results */}
            {parsedData && !isParsing && (
              <div className={`space-y-2 p-3 rounded-lg border ${
                parsedData.confidence > 0 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {parsedData.confidence > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    parsedData.confidence > 0 
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {parsedData.confidence > 0 ? 'PDF Parsed Successfully' : 'PDF Parsing Failed'}
                  </span>
                  {parsedData.confidence > 0 && (
                    <Badge variant={parsedData.confidence > 70 ? "default" : "secondary"}>
                      {parsedData.confidence}% confidence
                    </Badge>
                  )}
                </div>
                {parsedData.confidence > 0 ? (
                  <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                    {parsedData.amount && <p>• Amount: ${parsedData.amount}</p>}
                    {parsedData.dueDate && <p>• Due Date: {parsedData.dueDate}</p>}
                    {parsedData.customerName && <p>• Customer: {parsedData.customerName}</p>}
                    {parsedData.customerEmail && <p>• Email: {parsedData.customerEmail}</p>}
                    {parsedData.invoiceNumber && <p>• Invoice #: {parsedData.invoiceNumber}</p>}
                  </div>
                ) : (
                  <div className="text-xs text-red-700 dark:text-red-300">
                    <p>• {parsedData.description}</p>
                    <p>• Check browser console for detailed error information</p>
                    <p>• Try uploading a different PDF or enter data manually</p>
                  </div>
                )}
                {parsedData.confidence > 0 && parsedData.confidence < 50 && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">Please verify the extracted data</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Button
              type='submit'
              disabled={isUploading}
              className='w-full'
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {invoiceData.file ? "Process PDF" : "Validate Form"}
                </>
              )}
            </Button>
            
            <Button
              type='button'
              onClick={handleGetQuote}
              disabled={isGettingQuote || !address || !isContractDeployed()}
              className='w-full'
              size="lg"
            >
              {isGettingQuote ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Get Factoring Quote
                </>
              )}
            </Button>
            
            {!address && (
              <p className="text-xs text-muted-foreground text-center">
                Connect your wallet to get factoring quotes
              </p>
            )}
            
            {address && !isContractDeployed() && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Contract Not Deployed
                  </span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Please deploy the smart contract first. Check the deployment guide in the contracts folder.
                </p>
              </div>
            )}

          </div>
        </form>
      </CardContent>
    </Card>
  );
}
