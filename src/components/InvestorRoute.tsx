import CustomWalletButton from "./CustomWalletButton";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Footer from "./Footer";
import QuickLiquidityDeposit from "./QuickLiquidityDeposit";
import EstimatedReturns from "./EstimatedReturns";

export default function InvestorRoute() {
  const { isConnected } = useAccount();

  return (
    <div className='min-h-screen bg-background'>
      <Helmet>
        <title>Invoicify - Provide Liquidity</title>
        <meta name='description' content='Earn yield by providing PYUSD liquidity for invoice factoring' />
        <link rel='canonical' href='https://invoice-factor.example.com/investor' />
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
                Earn Yield on
                <br />
                <span className='text-primary'>PYUSD</span>
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Provide liquidity to invoice factoring and earn 8-15% APR on your PYUSD holdings
              </p>
            </div>

            {/* Benefits Section */}
            {/* <div className='bg-muted/30 p-16 rounded-3xl space-y-12'>
              <div className='text-center space-y-4'>
                <h2 className='text-4xl font-bold text-foreground'>
                  Why Invest in Invoicify?
                </h2>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                  Diversify your portfolio with real-world business financing
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>High Returns</h3>
                    <p className='text-muted-foreground'>
                      Earn 8-15% APR on your PYUSD, significantly higher than traditional savings
                    </p>
                  </div>
                </div>

                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>Low Risk</h3>
                    <p className='text-muted-foreground'>
                      Backed by real business invoices with transparent risk assessment
                    </p>
                  </div>
                </div>

                <div className='text-center space-y-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto'>
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-bold text-foreground'>Instant Liquidity</h3>
                    <p className='text-muted-foreground'>
                      Withdraw your funds anytime with our flexible liquidity options
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* User Status */}
            {/* <div className='space-y-12'>
              <WalletInfo />
            </div> */}
            
            {/* Price Feed Widget
            <PythPriceWidget 
              symbols={['PYUSD', 'ETH']} 
              showRefresh={true}
              className="max-w-2xl mx-auto"
            /> */}

            {/* Main Workflow */}
            <div className='space-y-16'>
              {/* <DepositPYUSD /> */}
              <QuickLiquidityDeposit />
              <EstimatedReturns />
              {/* <RiskPreferences />
              <AutomaticMatching /> */}
              {/* <CollectReturns /> */}
            </div>
          </div>
        ) : (
          <div className='minimal-section text-center space-y-12'>
            <div className='space-y-8'>
              <h1 className='text-6xl font-bold text-foreground leading-tight'>
                Connect Your Wallet
              </h1>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Connect your wallet to start earning yield on PYUSD through invoice factoring
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
