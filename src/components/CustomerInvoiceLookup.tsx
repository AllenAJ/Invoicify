import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import ENSAddressInput from "./ENSAddressInput";
import PaymentConfirmationDialog from "./PaymentConfirmationDialog";
import { useCustomerInvoices } from "@/hooks/useCustomerInvoices";
import { useInvoiceFactoring } from "@/hooks/invoiceFactoring";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

export default function CustomerInvoiceLookup() {
  const { address } = useAccount();
  const { payToLiquidityPool } = useInvoiceFactoring();
  const [searchInput, setSearchInput] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const [paidInvoices, setPaidInvoices] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const { invoices, loading, error, updateInvoiceStatus, refetch } = useCustomerInvoices(
    searchInput.includes('.eth') ? searchInput : undefined,
    resolvedAddress || undefined
  );


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'created': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'factored': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'created': return <FileText className="h-4 w-4" />;
      case 'factored': return <CheckCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePayInvoice = (invoice: any) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Show confirmation dialog first
    setSelectedInvoice(invoice);
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;

    setIsPaying(selectedInvoice.id);
    setShowConfirmation(false);
    
    try {
      console.log('💳 Starting PYUSD payment to liquidity pool for invoice:', selectedInvoice.invoice_number);
      
      // Show loading message for approval and payment
      toast.loading("🔄 First approving PYUSD spending, then paying 10 PYUSD to liquidity pool...", { duration: 3000 });
      
      // Pay 10 PYUSD to liquidity pool using MetaMask
      await payToLiquidityPool("10");
      
      console.log('✅ PYUSD payment completed for invoice:', selectedInvoice.id);
      
      // Update invoice status in database (if possible)
      try {
        await updateInvoiceStatus(selectedInvoice.id, 'paid');
        console.log('✅ Database status updated to paid');
      } catch (dbError) {
        console.warn('⚠️ Could not update database status, but PYUSD payment succeeded');
      }
      
      // Mark invoice as paid locally for immediate UI update
      setPaidInvoices(prev => new Set([...prev, selectedInvoice.id]));
      
      // Show success message with settlement info
      toast.success(
        `🎉 Payment successful! Paid 10 PYUSD to liquidity pool for Invoice #${selectedInvoice.invoice_number}`,
        { duration: 5000 }
      );
      
      // Show additional confirmation
      setTimeout(() => {
        toast.success('💰 Settlement completed! Check your wallet transaction.', { duration: 3000 });
      }, 1000);
      
    } catch (error: any) {
      console.error("Error paying to liquidity pool:", error);
      
      // Provide specific error messages like the investor deposit
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('Insufficient')) {
        toast.error("❌ Insufficient PYUSD balance. You need at least 10 PYUSD in your wallet.");
      } else if (errorMessage.includes('allowance') || errorMessage.includes('approve')) {
        toast.error("❌ Need to approve PYUSD spending. Please approve the contract to spend your PYUSD first.");
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        toast.error("❌ Transaction was rejected. Please try again and confirm the transaction.");
      } else {
        toast.error(`❌ Payment failed: ${errorMessage}`);
      }
    } finally {
      setIsPaying(null);
      setSelectedInvoice(null);
    }
  };

  const canPayInvoice = (invoice: any) => {
    return (invoice.status === 'created' || invoice.status === 'factored') && 
           !paidInvoices.has(invoice.id);
    // Note: Real PYUSD payment to liquidity pool
  };

  return (
    <div className='minimal-card space-y-8'>
      <div className='text-center space-y-4'>
        <h2 className='text-3xl font-bold text-foreground'>
          Look Up Your Invoices
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Enter your ENS name or wallet address to find and pay your invoices
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto">
        <ENSAddressInput
          label="Your ENS Name or Wallet Address"
          placeholder="alice.eth or 0x..."
          value={searchInput}
          onChange={setSearchInput}
          onAddressResolved={setResolvedAddress}
          required={false}
        />
      </div>

      {/* Results */}
      {loading && (
        <div className='text-center space-y-4 py-12'>
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className='text-muted-foreground'>Searching for invoices...</p>
        </div>
      )}

      {error && (
        <div className='text-center space-y-4 py-12'>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className='text-red-600 dark:text-red-400'>Error: {error}</p>
        </div>
      )}

      {!loading && !error && invoices.length === 0 && searchInput && (
        <div className='text-center space-y-4 py-12'>
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <div className='space-y-2'>
            <h3 className='text-xl font-bold text-foreground'>No Invoices Found</h3>
            <p className='text-muted-foreground'>
              No invoices found for {searchInput.includes('.eth') ? searchInput : 'this address'}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && invoices.length > 0 && (
        <div className='space-y-6'>
          <div className='text-center space-y-4'>
            <h3 className='text-2xl font-bold text-foreground'>
              Found {invoices.length} Invoice{invoices.length !== 1 ? 's' : ''}
            </h3>
            <div className='flex gap-2'>
              <Button
                onClick={refetch}
                disabled={loading}
                variant="outline"
                size="sm"
                className='minimal-button'
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Refresh
              </Button>
            </div>
          </div>
          

          {/* Settlement Success Banner */}
          {paidInvoices.size > 0 && (
            <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center space-y-3'>
              <div className='flex items-center justify-center gap-3'>
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h4 className='text-xl font-bold text-green-800 dark:text-green-200'>
                  Settlement Completed!
                </h4>
              </div>
              <p className='text-green-700 dark:text-green-300'>
                {paidInvoices.size} invoice{paidInvoices.size !== 1 ? 's' : ''} paid successfully with 10 PYUSD each
              </p>
              <p className='text-sm text-green-600 dark:text-green-400'>
                All payments have been sent to the liquidity pool via MetaMask
              </p>
            </div>
          )}

          {invoices.map((invoice) => (
            <div key={invoice.id} className='minimal-card space-y-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <h4 className='text-xl font-bold text-foreground'>
                      {invoice.invoice_number || `Invoice #${invoice.id.slice(-8)}`}
                    </h4>
                    <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground'>{invoice.description}</p>
                </div>
                <div className='text-right space-y-1'>
                  <p className='text-2xl font-bold text-foreground'>
                    {formatCurrency(invoice.amount)}
                  </p>
                  {invoice.due_date && (
                    <p className='text-sm text-muted-foreground'>
                      Due: {formatDate(invoice.due_date)}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <User className="h-4 w-4" />
                    <span className='text-sm font-medium'>From</span>
                  </div>
                  <p className='text-foreground'>{invoice.customer_name}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Mail className="h-4 w-4" />
                    <span className='text-sm font-medium'>Email</span>
                  </div>
                  <p className='text-foreground'>{invoice.customer_email}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Calendar className="h-4 w-4" />
                    <span className='text-sm font-medium'>Created</span>
                  </div>
                  <p className='text-foreground'>{formatDate(invoice.created_at)}</p>
                </div>
              </div>

              {/* Payment Section */}
              <div className='flex items-center justify-between pt-4 border-t border-border'>
                <div className='space-y-1'>
                  {paidInvoices.has(invoice.id) || invoice.status === 'paid' ? (
                    <div className='space-y-2'>
                      <p className='text-sm text-green-600 dark:text-green-400 font-medium'>
                        ✅ Payment completed with 10 PYUSD via MetaMask
                      </p>
                      <p className='text-xs text-green-600 dark:text-green-400'>
                        Sent to liquidity pool successfully
                      </p>
                    </div>
                  ) : canPayInvoice(invoice) ? (
                    <div className='space-y-1'>
                      <p className='text-sm text-muted-foreground'>
                        Ready to pay with PYUSD
                      </p>
                      <p className='text-xs text-primary font-medium'>
                        Payment amount: 10 PYUSD (to liquidity pool)
                      </p>
                    </div>
                  ) : invoice.status === 'draft' ? (
                    <p className='text-sm text-muted-foreground'>
                      Invoice is still in draft status
                    </p>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Invoice not ready for payment
                    </p>
                  )}
                </div>
                
                <div className='flex gap-2'>
                  {invoice.pdf_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.pdf_url, '_blank')}
                      className='minimal-button'
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  )}
                  
                  {canPayInvoice(invoice) && !paidInvoices.has(invoice.id) && invoice.status !== 'paid' && (
                    <Button
                      onClick={() => handlePayInvoice(invoice)}
                      disabled={isPaying === invoice.id}
                      className='minimal-button bg-primary text-primary-foreground hover:bg-primary/90'
                      size="sm"
                    >
                      {isPaying === invoice.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Pay 10 PYUSD
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Confirmation Dialog */}
      <PaymentConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleConfirmPayment}
        invoiceNumber={selectedInvoice?.invoice_number || selectedInvoice?.id?.slice(-8) || 'Unknown'}
        paymentAmount={10}
        isLoading={isPaying === selectedInvoice?.id}
      />
    </div>
  );
}
