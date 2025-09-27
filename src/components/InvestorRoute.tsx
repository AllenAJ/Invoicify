import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import DepositPYUSD from "./DepositPYUSD";
import RiskPreferences from "./RiskPreferences";
import AutomaticMatching from "./AutomaticMatching";
import CollectReturns from "./CollectReturns";

export default function InvestorRoute() {
  const { isConnected } = useAccount();

  return (
    <div className='container   p-4 md:p-8 mx-auto flex flex-col min-h-screen gap-8'>
      <Helmet>
        <title>Invoice Factor - For Investors</title>
        <meta name='description' content='Earn yield by providing PYUSD liquidity for invoice factoring' />
        <link rel='canonical' href='https://invoice-factor.example.com/investor' />
      </Helmet>
      
      <nav className='flex flex-row gap-4 items-center justify-between'>
        <div>
          <h1 className='text-xl font-black'>Invoice Factor</h1>
          <p className='text-sm text-gray-500'>For Investors - Earn Yield on PYUSD</p>
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
            
            {/* Investor Workflow Steps */}
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold mb-2'>Earn 8-15% APR on PYUSD</h2>
                <p className='text-gray-500'>
                  Provide liquidity to invoice factoring and earn competitive returns
                </p>
              </div>
              
              {/* Step 1: Deposit PYUSD */}
              <DepositPYUSD />
              
              {/* Step 2: Set Risk Preferences */}
              <RiskPreferences />
              
              {/* Step 3: Automatic Matching */}
              <AutomaticMatching />
              
              {/* Step 4: Collect Returns */}
              <CollectReturns />
            </div>
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-2xl font-bold mb-4'>Connect Your Investor Wallet</h2>
            <p className='text-gray-500 mb-8'>
              Connect your wallet to start earning yield on PYUSD through invoice factoring
            </p>
            <ConnectButton />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
