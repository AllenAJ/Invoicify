import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, DollarSign, Calendar, User, Mail } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceData(prev => ({ ...prev, file }));
    }
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
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
              Invoice PDF (Optional)
            </Label>
            <Input
              type='file'
              id='file'
              accept='.pdf'
              onChange={handleFileChange}
            />
            <p className='text-xs text-muted-foreground'>
              Upload your invoice PDF for faster processing
            </p>
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
