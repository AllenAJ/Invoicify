import { useState } from "react";
import toast from "react-hot-toast";

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
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          1
        </div>
        <h3 className='text-lg font-bold'>Upload Invoice</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Upload your invoice PDF and provide customer details to get an instant quote
      </p>
      
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='amount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Invoice Amount (USD) *
            </label>
            <input
              type='number'
              id='amount'
              value={invoiceData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              placeholder='10000'
              step='0.01'
              min='0'
              required
            />
          </div>
          
          <div>
            <label htmlFor='dueDate' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Due Date *
            </label>
            <input
              type='date'
              id='dueDate'
              value={invoiceData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              required
            />
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='customerName' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Customer Name *
            </label>
            <input
              type='text'
              id='customerName'
              value={invoiceData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              placeholder='Acme Corp'
              required
            />
          </div>
          
          <div>
            <label htmlFor='customerEmail' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Customer Email *
            </label>
            <input
              type='email'
              id='customerEmail'
              value={invoiceData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              placeholder='billing@acme.com'
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description
          </label>
          <textarea
            id='description'
            value={invoiceData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
            placeholder='Services rendered, products delivered, etc.'
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor='file' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Invoice PDF (Optional)
          </label>
          <input
            type='file'
            id='file'
            accept='.pdf'
            onChange={handleFileChange}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Upload your invoice PDF for faster processing
          </p>
        </div>
        
        <button
          type='submit'
          disabled={isUploading}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors'
        >
          {isUploading ? 'Uploading...' : 'Upload Invoice'}
        </button>
      </form>
    </div>
  );
}
