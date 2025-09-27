import { useState } from "react";
import toast from "react-hot-toast";

export default function InvoiceForm() {
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [debtorAddress, setDebtorAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceAmount || !invoiceDescription || !debtorAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    // TODO: Implement invoice factoring logic
    toast.success("Invoice submitted successfully!");
    
    // Reset form
    setInvoiceAmount("");
    setInvoiceDescription("");
    setDebtorAddress("");
  };

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <h2 className='text-lg font-bold mb-4'>Create Invoice</h2>
      
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='amount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Invoice Amount (PYUSD)
          </label>
          <input
            type='number'
            id='amount'
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
            placeholder='1000'
            step='0.01'
            min='0'
          />
        </div>
        
        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description
          </label>
          <textarea
            id='description'
            value={invoiceDescription}
            onChange={(e) => setInvoiceDescription(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
            placeholder='Invoice for services rendered...'
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor='debtor' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Debtor Address
          </label>
          <input
            type='text'
            id='debtor'
            value={debtorAddress}
            onChange={(e) => setDebtorAddress(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
            placeholder='0x...'
          />
        </div>
        
        <button
          type='submit'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors'
        >
          Submit Invoice
        </button>
      </form>
    </div>
  );
}
