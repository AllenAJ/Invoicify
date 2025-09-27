# Invoice Factor

A simple invoice factoring platform built with React, TypeScript, and Web3 technologies, specifically designed to work with PYUSD on Sepolia testnet.

## Features

- 🔗 Wallet connection using RainbowKit
- 💰 PYUSD token integration on Sepolia
- 📝 Invoice creation and management
- 🏢 Business owner workflow for selling invoices
- 📊 Instant quote calculation
- 💳 Accept offers and receive PYUSD immediately
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite
- 🧭 Multi-page routing with React Router

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   VITE_SEPOLIA_RPC_URL=your_sepolia_rpc_url
   ```

3. **Get PYUSD on Sepolia:**
   - Visit the [PYUSD Sepolia faucet](https://faucet.sepolia.ethpandaops.io/)
   - Or use the official PYUSD testnet faucet

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Routes

- **`/`** - Main invoice factoring platform
- **`/business`** - Business owner workflow for selling invoices
- **`/investor`** - Investor/factor workflow for providing liquidity
- **`/customer`** - Invoice payer workflow for paying with PYUSD

## Business Owner Workflow

The `/business` route provides a complete workflow for business owners to sell their invoices:

1. **Connect Wallet** → Business connects their PayPal/MetaMask wallet containing PYUSD
2. **Upload Invoice** → Upload invoice PDF/data (customer details, amount, due date)
3. **Get Instant Quote** → Smart contract calculates offer (e.g., $8,000 PYUSD for $10,000 invoice)
4. **Accept Offer** → Receive PYUSD immediately to wallet
5. **Customer Pays** → When customer pays original invoice, debt is settled automatically

## Investor/Factor Workflow

The `/investor` route provides a complete workflow for investors to earn yield by providing liquidity:

1. **Deposit PYUSD** → Add PYUSD to liquidity pool to earn yield
2. **Set Risk Preferences** → Choose risk levels and minimum returns
3. **Automatic Matching** → Smart contract automatically factors invoices matching criteria
4. **Collect Returns** → Earn fees when invoices are paid (e.g., 8-15% APR)

## Invoice Payer Workflow

The `/customer` route provides a complete workflow for invoice payers (end customers):

1. **Receive Invoice** → Gets invoice with ENS payment address (business.eth)
2. **Pay with PYUSD** → Pays using any PYUSD-compatible wallet
3. **Automatic Settlement** → Payment automatically splits between business and factor

## Project Structure

```
src/
├── components/          # React components
│   ├── InvoiceFactor.tsx    # Main app component
│   ├── BusinessRoute.tsx    # Business owner workflow
│   ├── InvestorRoute.tsx    # Investor/factor workflow
│   ├── CustomerRoute.tsx    # Invoice payer workflow
│   ├── InvoiceUpload.tsx    # Invoice upload form
│   ├── InstantQuote.tsx     # Quote calculation display
│   ├── AcceptOffer.tsx      # Accept offer component
│   ├── DepositPYUSD.tsx     # PYUSD deposit component
│   ├── RiskPreferences.tsx  # Risk preferences settings
│   ├── AutomaticMatching.tsx # Automatic matching display
│   ├── CollectReturns.tsx   # Returns collection component
│   ├── ReceiveInvoice.tsx   # Invoice lookup component
│   ├── PayWithPYUSD.tsx     # PYUSD payment component
│   ├── AutomaticSettlement.tsx # Settlement display
│   ├── WalletInfo.tsx       # Wallet information display
│   ├── InvoiceForm.tsx      # Invoice creation form
│   └── Footer.tsx           # Footer component
├── hooks/               # Custom React hooks
│   ├── erc20.ts            # ERC20 token hooks
│   ├── paymentToken.ts     # Payment token utilities
│   └── changeObserver.ts   # State change observer
├── util/                # Utility functions
│   └── format.ts           # Formatting utilities
├── config.ts            # Wagmi and app configuration
├── App.tsx              # Main app wrapper with routing
└── main.tsx             # App entry point
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum React hooks
- **RainbowKit** - Wallet connection UI
- **Viem** - Ethereum library
- **React Query** - Data fetching and caching

## Network Configuration

The app is configured to work with:
- **Sepolia Testnet** - For development and testing
- **PYUSD Token** - `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
