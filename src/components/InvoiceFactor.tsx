import CustomWalletButton from "./CustomWalletButton";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "./Footer";
import { BentoDemo } from "./BentoDemo";
import { HeroScrollDemo } from "./HeroScrollDemo";

export default function InvoiceFactor() {
  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Invoicify - Instant PYUSD Invoice Factoring</title>
        <meta name='description' content='Get instant PYUSD payment for your outstanding invoices. Fast, secure, and transparent invoice factoring on Ethereum.' />
        <link rel='canonical' href='https://invoice-factor.example.com' />
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
      <main>
        <div className='minimal-section space-y-24'>
          {/* Hero Section with Scroll Animation */}
          <HeroScrollDemo />

          {/* Features Section */}
          <div className='space-y-16'>
            <div className='text-center space-y-4'>
              <h2 className='text-4xl font-bold text-foreground'>
                How It Works
              </h2>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Simple, fast, and secure invoice factoring
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              <div className='text-center space-y-6'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <span className='text-2xl font-bold text-primary'>1</span>
                </div>
                <div className='space-y-3'>
                  <h3 className='text-xl font-bold text-foreground'>Upload Invoice</h3>
                  <p className='text-muted-foreground'>
                    Upload your PDF invoice or enter details manually. Our AI extracts all the information automatically.
                  </p>
                </div>
              </div>

              <div className='text-center space-y-6'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <span className='text-2xl font-bold text-primary'>2</span>
                </div>
                <div className='space-y-3'>
                  <h3 className='text-xl font-bold text-foreground'>Get Instant Quote</h3>
                  <p className='text-muted-foreground'>
                    Receive an immediate factoring quote with transparent fees. No hidden costs, no surprises.
                  </p>
                </div>
              </div>

              <div className='text-center space-y-6'>
                <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                  <span className='text-2xl font-bold text-primary'>3</span>
                </div>
                <div className='space-y-3'>
                  <h3 className='text-xl font-bold text-foreground'>Receive PYUSD</h3>
                  <p className='text-muted-foreground'>
                    Accept the quote and receive PYUSD in your wallet instantly. We handle the rest.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          {/* <div className='paypal-light-bg p-16 rounded-3xl space-y-12 border border-[#e6f2ff]'>
            <div className='text-center space-y-4'>
              <h2 className='text-4xl font-bold text-foreground'>
                Why Choose Invoicify?
              </h2>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Built for modern businesses that need fast, reliable invoice financing
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>Instant Settlement</h3>
                    <p className='text-muted-foreground'>Get paid immediately, not in 30-90 days</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>Transparent Fees</h3>
                    <p className='text-muted-foreground'>Clear, upfront pricing with no hidden costs</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>PYUSD Payments</h3>
                    <p className='text-muted-foreground'>Receive payments in PayPal's stablecoin</p>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>AI-Powered</h3>
                    <p className='text-muted-foreground'>Automatic invoice parsing and data extraction</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>Blockchain Security</h3>
                    <p className='text-muted-foreground'>Secure, transparent transactions on Ethereum</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 paypal-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>No Credit Checks</h3>
                    <p className='text-muted-foreground'>Approval based on invoice quality, not credit history</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Features Grid */}
          <div className='space-y-12'>
            <div className='text-center space-y-4'>
              <h2 className='text-4xl font-bold text-foreground'>
                Powerful Features
              </h2>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Everything you need to manage your invoices and get paid instantly
              </p>
            </div>
            <BentoDemo />
          </div>

          {/* CTA Section */}
          <div className='text-center space-y-8'>
            <h2 className='text-4xl font-bold text-foreground'>
              Ready to Get Started?
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Connect your wallet and start factoring invoices in minutes
            </p>
            <div className='flex justify-center gap-4'>
              <Link to="/factor-your-invoice">
                <button className='minimal-button paypal-primary flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300'>
                  Start Factoring
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/investor">
                <button className='minimal-button paypal-secondary shadow-lg hover:shadow-xl transition-all duration-300'>
                Provide Liquidity
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
