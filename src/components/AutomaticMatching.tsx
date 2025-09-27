import { useState, useEffect } from "react";

interface MatchedInvoice {
  id: string;
  amount: number;
  customerName: string;
  dueDate: string;
  riskScore: 'low' | 'medium' | 'high';
  expectedReturn: number;
  status: 'active' | 'paid' | 'overdue';
  matchedAt: string;
}

export default function AutomaticMatching() {
  const [matchedInvoices, setMatchedInvoices] = useState<MatchedInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [activeInvoices, setActiveInvoices] = useState(0);

  // Simulate loading matched invoices
  useEffect(() => {
    const loadMatchedInvoices = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data
      const mockInvoices: MatchedInvoice[] = [
        {
          id: 'INV-001',
          amount: 15000,
          customerName: 'Acme Corp',
          dueDate: '2024-02-15',
          riskScore: 'low',
          expectedReturn: 12.5,
          status: 'active',
          matchedAt: '2024-01-15'
        },
        {
          id: 'INV-002',
          amount: 8500,
          customerName: 'TechStart Inc',
          dueDate: '2024-02-20',
          riskScore: 'medium',
          expectedReturn: 15.2,
          status: 'active',
          matchedAt: '2024-01-18'
        },
        {
          id: 'INV-003',
          amount: 25000,
          customerName: 'Global Solutions',
          dueDate: '2024-01-30',
          riskScore: 'low',
          expectedReturn: 11.8,
          status: 'paid',
          matchedAt: '2024-01-10'
        }
      ];
      
      setMatchedInvoices(mockInvoices);
      
      // Calculate totals
      const total = mockInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
      const active = mockInvoices.filter(invoice => invoice.status === 'active').length;
      
      setTotalInvested(total);
      setActiveInvoices(active);
      setIsLoading(false);
    };

    loadMatchedInvoices();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            3
          </div>
          <h3 className='text-lg font-bold'>Automatic Matching</h3>
        </div>
        
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-500'>Finding invoices that match your criteria...</p>
          <p className='text-sm text-gray-400 mt-2'>
            Smart contracts are analyzing available invoices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          3
        </div>
        <h3 className='text-lg font-bold'>Automatic Matching</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Smart contracts automatically match your PYUSD with invoices that meet your risk criteria
      </p>
      
      {/* Summary Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
            ${totalInvested.toLocaleString()}
          </p>
          <p className='text-sm text-blue-700 dark:text-blue-300'>Total Invested</p>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
            {activeInvoices}
          </p>
          <p className='text-sm text-green-700 dark:text-green-300'>Active Invoices</p>
        </div>
        
        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center'>
          <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
            13.2%
          </p>
          <p className='text-sm text-purple-700 dark:text-purple-300'>Avg Return</p>
        </div>
      </div>
      
      {/* Matched Invoices List */}
      <div className='space-y-4'>
        <h4 className='font-semibold text-gray-800 dark:text-gray-200'>Your Matched Invoices:</h4>
        
        {matchedInvoices.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <p>No invoices matched yet</p>
            <p className='text-sm mt-1'>Invoices will appear here as they match your criteria</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {matchedInvoices.map((invoice) => (
              <div key={invoice.id} className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h5 className='font-semibold text-gray-800 dark:text-gray-200'>
                        {invoice.id}
                      </h5>
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(invoice.riskScore)}`}>
                        {invoice.riskScore.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400'>
                      <div>
                        <span className='font-medium'>Amount:</span>
                        <p>${invoice.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className='font-medium'>Customer:</span>
                        <p>{invoice.customerName}</p>
                      </div>
                      <div>
                        <span className='font-medium'>Due Date:</span>
                        <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className='font-medium'>Return:</span>
                        <p className='text-green-600 dark:text-green-400 font-semibold'>
                          {invoice.expectedReturn}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* How It Works */}
      <div className='mt-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
        <h4 className='font-semibold text-purple-800 dark:text-purple-200 mb-2'>How Automatic Matching Works:</h4>
        <ul className='text-sm text-purple-700 dark:text-purple-300 space-y-1'>
          <li>• Smart contracts analyze all available invoices in real-time</li>
          <li>• Your funds are automatically matched with invoices meeting your criteria</li>
          <li>• Risk assessment algorithms ensure optimal risk-return balance</li>
          <li>• Diversification across multiple invoices reduces overall risk</li>
          <li>• You earn returns when customers pay their invoices</li>
        </ul>
      </div>
    </div>
  );
}
