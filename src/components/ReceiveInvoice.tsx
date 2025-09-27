import { useState } from "react";
import toast from "react-hot-toast";

interface InvoiceData {
  invoiceId: string;
  businessName: string;
  businessENS: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
}

export default function ReceiveInvoice() {
  const [invoiceId, setInvoiceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleLookupInvoice = async () => {
    if (!invoiceId.trim()) {
      toast.error("Please enter an invoice ID");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to lookup invoice
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock invoice data
      const mockInvoice: InvoiceData = {
        invoiceId: invoiceId,
        businessName: "Acme Corporation",
        businessENS: "acme.eth",
        amount: 15000,
        dueDate: "2024-02-15",
        description: "Professional services rendered - Q1 2024 consulting",
        status: 'pending'
      };
      
      setInvoiceData(mockInvoice);
      toast.success("Invoice found successfully!");
    } catch (error) {
      toast.error("Invoice not found. Please check the invoice ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInvoice = () => {
    setInvoiceData(null);
    setInvoiceId("");
  };

  if (invoiceData) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            ✓
          </div>
          <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>Invoice Found!</h3>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400 mb-2'>
              ${invoiceData.amount.toLocaleString()}
            </p>
            <p className='text-gray-600 dark:text-gray-400'>
              Due: {new Date(invoiceData.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <span className='text-gray-600 dark:text-gray-400'>Invoice ID:</span>
              <p className='font-semibold'>{invoiceData.invoiceId}</p>
            </div>
            <div>
              <span className='text-gray-600 dark:text-gray-400'>Business:</span>
              <p className='font-semibold'>{invoiceData.businessName}</p>
            </div>
            <div>
              <span className='text-gray-600 dark:text-gray-400'>ENS Address:</span>
              <p className='font-semibold text-blue-600 dark:text-blue-400'>{invoiceData.businessENS}</p>
            </div>
            <div>
              <span className='text-gray-600 dark:text-gray-400'>Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                invoiceData.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {invoiceData.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div>
            <span className='text-gray-600 dark:text-gray-400'>Description:</span>
            <p className='font-semibold'>{invoiceData.description}</p>
          </div>
          
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Payment Information:</h4>
            <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• Pay to ENS address: <span className='font-mono'>{invoiceData.businessENS}</span></li>
              <li>• Amount: ${invoiceData.amount.toLocaleString()} PYUSD</li>
              <li>• Payment will be automatically split between business and factor</li>
              <li>• No additional fees for PYUSD payments</li>
            </ul>
          </div>
          
          <div className='text-center'>
            <button
              onClick={handleClearInvoice}
              className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              Look Up Different Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          1
        </div>
        <h3 className='text-lg font-bold'>Receive Invoice</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Enter your invoice ID to retrieve payment details with ENS address
      </p>
      
      <div className='space-y-6'>
        {/* Invoice Lookup Form */}
        <div>
          <label htmlFor='invoiceId' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Invoice ID
          </label>
          <div className='flex gap-2'>
            <input
              type='text'
              id='invoiceId'
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              placeholder='INV-2024-001 or invoice hash'
            />
            <button
              onClick={handleLookupInvoice}
              disabled={isLoading || !invoiceId.trim()}
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Looking up...
                </div>
              ) : (
                'Look Up'
              )}
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            Enter the invoice ID provided by your vendor
          </p>
        </div>
        
        {/* Example Invoice */}
        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
          <h4 className='font-semibold mb-2'>Example Invoice ID formats:</h4>
          <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
            <li>• <span className='font-mono'>INV-2024-001</span> - Standard invoice ID</li>
            <li>• <span className='font-mono'>0x1234...abcd</span> - Invoice hash</li>
            <li>• <span className='font-mono'>acme-001</span> - Business-specific ID</li>
          </ul>
        </div>
        
        {/* How It Works */}
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>How it works:</h4>
          <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
            <li>• Enter your invoice ID to retrieve payment details</li>
            <li>• Get the ENS address (e.g., business.eth) for payment</li>
            <li>• Pay using any PYUSD-compatible wallet</li>
            <li>• Payment automatically splits between business and factor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
