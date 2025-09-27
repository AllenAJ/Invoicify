import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import InvoiceUpload from "./InvoiceUpload";
import InstantQuote from "./InstantQuote";
import ContractStatus from "./ContractStatus";
import UserProfile from "./UserProfile";

export default function BusinessRoute() {
  const { isConnected } = useAccount();
  const [quoteData, setQuoteData] = useState<{
    factorAmount: string;
    fee: string;
    netAmount: string;
    dueDate: string;
  } | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuoteGenerated = (quote: typeof quoteData, amount: string) => {
    setQuoteData(quote);
    setInvoiceAmount(amount);
  };

  const handleAcceptQuote = () => {
    setIsProcessing(true);
    // Reset after processing
    setTimeout(() => {
      setQuoteData(null);
      setInvoiceAmount("");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Invoice Factor - For Business</title>
        <meta name='description' content='Sell your invoices for instant PYUSD payment' />
        <link rel='canonical' href='https://invoice-factor.example.com/business' />
      </Helmet>
      
      {/* Minimal Top Navigation */}
      <nav className='minimal-nav'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              <Link to="/" className='text-2xl font-bold text-foreground'>
                Invoice Factor
              </Link>
              <div className='hidden md:flex items-center gap-6'>
                <Link to="/investor" className='text-muted-foreground hover:text-foreground transition-colors'>
                  For Investors
                </Link>
                <Link to="/customer" className='text-muted-foreground hover:text-foreground transition-colors'>
                  Pay Invoice
                </Link>
                <Link to="/dashboard" className='text-muted-foreground hover:text-foreground transition-colors'>
                  Dashboard
                </Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='pt-24'>
        {isConnected ? (
          <div className='minimal-section space-y-24'>
            {/* Hero Section */}
            <div className='text-center space-y-8'>
              <h1 className='text-6xl font-bold text-foreground leading-tight'>
                Sell Your Invoices
                <br />
                <span className='text-primary'>Instantly</span>
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Get immediate PYUSD payment for your outstanding invoices. 
                No waiting, no hassle.
              </p>
            </div>

            {/* User Status */}
            {/* <div className='space-y-12'>
              <UserProfile />
              <WalletInfo />
              <ContractStatus />
            </div> */}
            
            {/* Main Workflow */}
            <div className='space-y-16'>
              <InvoiceUpload 
                onQuoteGenerated={handleQuoteGenerated}
                onAcceptQuote={handleAcceptQuote}
                isProcessing={isProcessing}
              />
              
              <InstantQuote 
                quoteData={quoteData}
                invoiceAmount={invoiceAmount}
                onAcceptQuote={handleAcceptQuote}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        ) : (
          <div className='minimal-section text-center space-y-12'>
            <div className='space-y-8'>
              <h1 className='text-6xl font-bold text-foreground leading-tight'>
                Connect Your Wallet
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Connect your wallet to start selling invoices for instant PYUSD payment
              </p>
            </div>
            <div className='flex justify-center'>
              <ConnectButton />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
