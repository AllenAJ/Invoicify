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

interface InvoiceData {
  amount: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  description: string;
  file?: File;
}

export default function InvoiceUpload() {
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
        
        // Auto-fill form with extracted data
        if (extracted.confidence > 30) {
          setInvoiceData(prev => ({
            ...prev,
            amount: extracted.amount || prev.amount,
            dueDate: extracted.dueDate || prev.dueDate,
            customerName: extracted.customerName || prev.customerName,
            customerEmail: extracted.customerEmail || prev.customerEmail,
            description: extracted.description || prev.description,
          }));
          
          toast.success(`Invoice parsed successfully! (${extracted.confidence}% confidence)`);
        } else {
          toast.warning("Invoice parsed with low confidence. Please verify the extracted data.");
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
      
      if (extracted.confidence > 30) {
        setInvoiceData(prev => ({
          ...prev,
          amount: extracted.amount || prev.amount,
          dueDate: extracted.dueDate || prev.dueDate,
          customerName: extracted.customerName || prev.customerName,
          customerEmail: extracted.customerEmail || prev.customerEmail,
          description: extracted.description || prev.description,
        }));
        
        toast.success(`Invoice parsed successfully! (${extracted.confidence}% confidence)`);
      } else {
        toast.warning("Invoice parsed with low confidence. Please verify the extracted data.");
      }
    } catch (error) {
      toast.error("Failed to parse PDF. Please fill in the form manually.");
    } finally {
      setIsParsing(false);
      setTimeout(() => setParseProgress(0), 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceData.amount || !invoiceData.dueDate || !invoiceData.customerName || !invoiceData.customerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Invoice uploaded successfully!");
      
      // Reset form
      setInvoiceData({
        amount: "",
        dueDate: "",
        customerName: "",
        customerEmail: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to upload invoice");
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
              <div className="space-y-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    PDF Parsed Successfully
                  </span>
                  <Badge variant={parsedData.confidence > 70 ? "default" : "secondary"}>
                    {parsedData.confidence}% confidence
                  </Badge>
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  {parsedData.amount && <p>• Amount: ${parsedData.amount}</p>}
                  {parsedData.dueDate && <p>• Due Date: {parsedData.dueDate}</p>}
                  {parsedData.customerName && <p>• Customer: {parsedData.customerName}</p>}
                  {parsedData.customerEmail && <p>• Email: {parsedData.customerEmail}</p>}
                  {parsedData.invoiceNumber && <p>• Invoice #: {parsedData.invoiceNumber}</p>}
                </div>
                {parsedData.confidence < 50 && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">Please verify the extracted data</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
                Upload Invoice
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
