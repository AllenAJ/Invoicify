import CustomWalletButton from "./CustomWalletButton";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Download,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";

export default function DashboardRoute() {
  const { isConnected } = useAccount();
  const { user } = useSupabaseAuth();
  const { invoices, loading: invoicesLoading, error: invoicesError } = useInvoices(user?.id);
  // Note: contractBalance and userBalance are not used in this component

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
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'created': return <FileText className="h-4 w-4" />;
      case 'factored': return <TrendingUp className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const totalInvoiceValue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalFactoredValue = invoices
    .filter(invoice => invoice.status === 'factored' || invoice.status === 'paid')
    .reduce((sum, invoice) => sum + (invoice.factor_amount || 0), 0);

  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Dashboard - Invoicify</title>
        <meta name='description' content='View your wallet details and invoice history' />
        <link rel='canonical' href='https://invoice-factor.example.com/dashboard' />
      </Helmet>
      
      {/* Minimal Top Navigation */}
      <nav className='minimal-nav'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              <Link to="/" className='flex items-center gap-3 text-2xl font-bold text-foreground'>
                <img 
                  src="/PYUSD-token.png" 
                  alt="PYUSD" 
                  className="w-8 h-8 rounded-full"
                />
                Invoicify
              </Link>
              <div className='hidden md:flex items-center gap-6'>
                <Link to="/factor-your-invoice" className='text-muted-foreground hover:text-foreground transition-colors'>
                  For Business
                </Link>
                <Link to="/investor" className='text-muted-foreground hover:text-foreground transition-colors'>
                Provide Liquidity
                </Link>
                <Link to="/customer" className='text-muted-foreground hover:text-foreground transition-colors'>
                  Pay Invoice
                </Link>
                <Link to="/dashboard" className='text-primary font-medium'>
                  Dashboard
                </Link>
              </div>
            </div>
            <CustomWalletButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='pt-24'>
        {isConnected ? (
          <div className='minimal-section space-y-16'>
            {/* Header */}
            <div className='text-center space-y-4'>
              <h1 className='text-5xl font-bold text-foreground'>
                Dashboard
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                Manage your wallet, view invoice history, and track your factoring activity
              </p>
            </div>

            {/* Wallet Information */}
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-foreground text-center'>
                Wallet Information
              </h2>
              <WalletInfo />
            </div>

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='minimal-card text-center space-y-4'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold text-foreground'>{invoices.length}</h3>
                  <p className='text-muted-foreground'>Total Invoices</p>
                </div>
              </div>

              <div className='minimal-card text-center space-y-4'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold text-foreground'>{formatCurrency(totalInvoiceValue)}</h3>
                  <p className='text-muted-foreground'>Total Invoice Value</p>
                </div>
              </div>

              <div className='minimal-card text-center space-y-4'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold text-foreground'>{formatCurrency(totalFactoredValue)}</h3>
                  <p className='text-muted-foreground'>Total Factored</p>
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div className='space-y-8'>
              <div className='flex items-center justify-between'>
                <h2 className='text-3xl font-bold text-foreground'>
                  Invoice History
                </h2>
                <Link to="/factor-your-invoice">
                  <Button className='minimal-button bg-primary text-primary-foreground hover:bg-primary/90'>
                    Create New Invoice
                  </Button>
                </Link>
              </div>

              {invoicesLoading ? (
                <div className='minimal-card text-center space-y-4 py-12'>
                  <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto'></div>
                  <p className='text-muted-foreground'>Loading invoices...</p>
                </div>
              ) : invoicesError ? (
                <div className='minimal-card text-center space-y-4 py-12'>
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  <p className='text-red-600 dark:text-red-400'>Error loading invoices: {invoicesError}</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className='minimal-card text-center space-y-6 py-16'>
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div className='space-y-2'>
                    <h3 className='text-xl font-bold text-foreground'>No Invoices Yet</h3>
                    <p className='text-muted-foreground'>Create your first invoice to get started</p>
                  </div>
                  <Link to="/factor-your-invoice">
                    <Button className='minimal-button bg-primary text-primary-foreground hover:bg-primary/90'>
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className='space-y-6'>
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className='minimal-card space-y-6'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-3'>
                            <h3 className='text-xl font-bold text-foreground'>
                              {invoice.invoice_number || `Invoice #${invoice.id.slice(-8)}`}
                            </h3>
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
                          {invoice.factor_amount && (
                            <p className='text-sm text-muted-foreground'>
                              Factored: {formatCurrency(invoice.factor_amount)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <User className="h-4 w-4" />
                            <span className='text-sm font-medium'>Customer</span>
                          </div>
                          <p className='text-foreground'>{invoice.customer_name}</p>
                        </div>

                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Calendar className="h-4 w-4" />
                            <span className='text-sm font-medium'>Due Date</span>
                          </div>
                          <p className='text-foreground'>{formatDate(invoice.due_date)}</p>
                        </div>

                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Mail className="h-4 w-4" />
                            <span className='text-sm font-medium'>Email</span>
                          </div>
                          <p className='text-foreground'>{invoice.customer_email}</p>
                        </div>
                      </div>

                      {invoice.pdf_url && (
                        <div className='flex items-center gap-4 pt-4 border-t border-border'>
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <FileText className="h-4 w-4" />
                            <span className='text-sm'>PDF: {invoice.pdf_filename}</span>
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(invoice.pdf_url, '_blank')}
                              className='minimal-button'
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = invoice.pdf_url!;
                                link.download = invoice.pdf_filename || 'invoice.pdf';
                                link.click();
                              }}
                              className='minimal-button'
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='minimal-section text-center space-y-12'>
            <div className='space-y-8'>
              <h1 className='text-6xl font-bold text-foreground leading-tight'>
                Connect Your Wallet
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Connect your wallet to view your dashboard and invoice history
              </p>
            </div>
            <div className='flex justify-center'>
              <CustomWalletButton />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
