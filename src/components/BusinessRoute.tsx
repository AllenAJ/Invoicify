import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import InvoiceUpload from "./InvoiceUpload";
import InstantQuote from "./InstantQuote";
import AcceptOffer from "./AcceptOffer";

export default function BusinessRoute() {
  const { isConnected } = useAccount();

  return (
    <div className='container max-w-4xl p-4 md:p-8 mx-auto flex flex-col min-h-screen gap-8'>
      <Helmet>
        <title>Invoice Factor - For Business</title>
        <meta name='description' content='Sell your invoices for instant PYUSD payment' />
        <link rel='canonical' href='https://invoice-factor.example.com/business' />
      </Helmet>
      
      <nav className='flex flex-row gap-4 items-center justify-between'>
        <div>
          <h1 className='text-xl font-black'>Invoice Factor</h1>
          <p className='text-sm text-gray-500'>For Business Owners - Sell Your Invoices</p>
        </div>
        <div className='flex items-center gap-4'>
          <Link 
            to="/" 
            className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            Home
          </Link>
          <Link 
            to="/investor" 
            className='text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
          >
            For Investors
          </Link>
          <Link 
            to="/customer" 
            className='text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300'
          >
            Pay Invoice
          </Link>
          <ConnectButton />
        </div>
      </nav>
      
      <div className='flex-1'>
        {isConnected ? (
          <div className='space-y-8'>
            <WalletInfo />
            
            {/* Business Workflow Steps */}
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold mb-2'>Sell Your Invoices for Instant PYUSD</h2>
                <p className='text-gray-500'>
                  Get immediate payment for your outstanding invoices
                </p>
              </div>
              
              {/* Step 1: Upload Invoice */}
              <InvoiceUpload />
              
              {/* Step 2: Get Instant Quote */}
              <InstantQuote />
              
              {/* Step 3: Accept Offer */}
              <AcceptOffer />
            </div>
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-2xl font-bold mb-4'>Connect Your Business Wallet</h2>
            <p className='text-gray-500 mb-8'>
              Connect your PayPal/MetaMask wallet containing PYUSD to start selling invoices
            </p>
            <ConnectButton />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
