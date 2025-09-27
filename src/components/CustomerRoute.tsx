import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import ReceiveInvoice from "./ReceiveInvoice";
import PayWithPYUSD from "./PayWithPYUSD";
import AutomaticSettlement from "./AutomaticSettlement";

export default function CustomerRoute() {
  const { isConnected } = useAccount();

  return (
    <div className='container   p-4 md:p-8 mx-auto flex flex-col min-h-screen gap-8'>
      <Helmet>
        <title>Invoice Factor - Pay Invoice</title>
        <meta name='description' content='Pay your invoices with PYUSD using any compatible wallet' />
        <link rel='canonical' href='https://invoice-factor.example.com/customer' />
      </Helmet>
      
      <nav className='flex flex-row gap-4 items-center justify-between'>
        <div>
          <h1 className='text-xl font-black'>Invoice Factor</h1>
          <p className='text-sm text-gray-500'>For Invoice Payers - Pay with PYUSD</p>
        </div>
        <div className='flex items-center gap-4'>
          <Link 
            to="/" 
            className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            Home
          </Link>
          <Link 
            to="/business" 
            className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            For Business
          </Link>
          <Link 
            to="/investor" 
            className='text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
          >
            For Investors
          </Link>
          <ConnectButton />
        </div>
      </nav>
      
      <div className='flex-1'>
        {isConnected ? (
          <div className='space-y-8'>
            <WalletInfo />
            
            {/* Customer Payment Workflow Steps */}
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold mb-2'>Pay Your Invoice with PYUSD</h2>
                <p className='text-gray-500'>
                  Simple, secure, and instant payment processing
                </p>
              </div>
              
              {/* Step 1: Receive Invoice */}
              <ReceiveInvoice />
              
              {/* Step 2: Pay with PYUSD */}
              <PayWithPYUSD />
              
              {/* Step 3: Automatic Settlement */}
              <AutomaticSettlement />
            </div>
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-2xl font-bold mb-4'>Connect Your Wallet to Pay</h2>
            <p className='text-gray-500 mb-8'>
              Connect your PYUSD-compatible wallet to pay invoices securely
            </p>
            <ConnectButton />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
