import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { CreditCard, Shield, Zap, CheckCircle } from "lucide-react";
import Footer from "./Footer";
import WalletInfo from "./WalletInfo";
import ReceiveInvoice from "./ReceiveInvoice";
import PayWithPYUSD from "./PayWithPYUSD";
import AutomaticSettlement from "./AutomaticSettlement";

export default function CustomerRoute() {
  const { isConnected } = useAccount();

  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Invoice Factor - Pay Invoice</title>
        <meta name='description' content='Pay your invoices with PYUSD using any compatible wallet' />
        <link rel='canonical' href='https://invoice-factor.example.com/customer' />
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
                <Link to="/business" className='text-muted-foreground hover:text-foreground transition-colors'>
                  For Business
                </Link>
                <Link to="/investor" className='text-muted-foreground hover:text-foreground transition-colors'>
                  For Investors
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
                Pay Your Invoice
                <br />
                <span className='text-primary'>with PYUSD</span>
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Simple, secure, and instant payment processing using PayPal's stablecoin
              </p>
            </div>

            {/* Benefits Section */}
            <div className='bg-muted/30 p-16 rounded-3xl space-y-12'>
              <div className='text-center space-y-4'>
                <h2 className='text-4xl font-bold text-foreground'>
                  Why Pay with PYUSD?
                </h2>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                  Experience the future of business payments
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>Instant Payments</h3>
                    <p className='text-muted-foreground'>
                      Pay invoices instantly with PYUSD, no waiting for bank transfers
                    </p>
                  </div>
                </div>

                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>Secure & Transparent</h3>
                    <p className='text-muted-foreground'>
                      Blockchain-powered security with full transaction transparency
                    </p>
                  </div>
                </div>

                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>Low Fees</h3>
                    <p className='text-muted-foreground'>
                      Minimal transaction fees compared to traditional payment methods
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Status */}
            <div className='space-y-12'>
              <WalletInfo />
            </div>
            
            {/* Main Workflow */}
            <div className='space-y-16'>
              <ReceiveInvoice />
              <PayWithPYUSD />
              <AutomaticSettlement />
            </div>
          </div>
        ) : (
          <div className='minimal-section text-center space-y-12'>
            <div className='space-y-8'>
              <h1 className='text-6xl font-bold text-foreground leading-tight'>
                Connect Your Wallet
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Connect your PYUSD-compatible wallet to pay invoices securely
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
