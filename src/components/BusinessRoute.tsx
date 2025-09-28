import { useState } from "react";
import CustomWalletButton from "./CustomWalletButton";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import InvoiceUpload from "./InvoiceUpload";
import InstantQuote from "./InstantQuote";
import toast from "react-hot-toast";

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
    
    // Simulate processing time (10-23 seconds)
    const processingTime = Math.floor(Math.random() * 13) + 10; // Random between 10-23 seconds
    console.log(`⏱️ Processing for ${processingTime} seconds...`);
    
    setTimeout(() => {
      // Show success message
      toast.success("🎉 Transaction completed! You received 8 PYUSD in your wallet!");
      
      // Additional success message
      setTimeout(() => {
        toast.success("💰 Check your wallet - your PYUSD balance has been updated!");
      }, 1000);
      
      // Reset processing state
      setIsProcessing(false);
      
      // Reset quote data
      setQuoteData(null);
      setInvoiceAmount("");
    }, processingTime * 1000);
  };

  const handleResetQuote = () => {
    setQuoteData(null);
    setInvoiceAmount("");
    setIsProcessing(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Invoicify - For Business</title>
        <meta name='description' content='Sell your invoices for instant PYUSD payment' />
        <link rel='canonical' href='https://invoice-factor.example.com/business' />
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
                <Link to="/investor" className='text-muted-foreground hover:text-foreground transition-colors'>
                  Provide Liquidity
                </Link>
                <Link to="/customer" className='text-muted-foreground hover:text-foreground transition-colors'>
                  Pay Invoice
                </Link>
                <Link to="/dashboard" className='text-muted-foreground hover:text-foreground transition-colors'>
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
                onResetQuote={handleResetQuote}
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
              <CustomWalletButton />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
