# Invoice Factoring Smart Contract

A simple and efficient smart contract for invoice factoring using PYUSD on ETH Sepolia.

## Features

- **Invoice Creation**: Businesses can create invoices with customer details
- **Invoice Factoring**: Investors can provide liquidity by factoring invoices (80% advance)
- **Payment Processing**: Customers can pay invoices directly to the contract
- **Liquidity Management**: Investors can deposit/withdraw liquidity
- **Return Collection**: Investors can collect their earned returns

## Contract Architecture

### Core Components

1. **Invoice Structure**
   - Business, customer, amount, due date
   - Factoring status and payment tracking
   - Factor details and amounts

2. **Investor Management**
   - Liquidity deposits and withdrawals
   - Return tracking and collection
   - Active factoring status

3. **Payment Flow**
   - 80% advance to business upon factoring
   - 20% profit to factor upon payment
   - Full amount recovery for liquidity pool

## Key Functions

### Business Functions
- `createInvoiceFromData()` - Create invoice from uploaded PDF data
- `factorInvoice()` - Factor an existing invoice

### Investor Functions
- `depositLiquidity()` - Provide liquidity to the pool
- `withdrawLiquidity()` - Withdraw unused liquidity
- `collectReturns()` - Collect earned returns

### Customer Functions
- `payInvoice()` - Pay a factored invoice

## Testing

```bash
# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testFactorInvoice
```

## Deployment

```bash
# Deploy to ETH Sepolia
forge script script/DeployInvoiceFactoring.s.sol --rpc-url sepolia --broadcast --verify

# Deploy to local network
forge script script/DeployInvoiceFactoring.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Environment Variables

Create a `.env` file with:
```
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## PYUSD Token

The contract uses PYUSD (PayPal USD) token on ETH Sepolia:
- Address: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`
- Decimals: 6
- Minimum factor amount: 50 PYUSD (for testing with 90 PYUSD)

## Security Features

- ReentrancyGuard protection
- Input validation
- Access control
- Safe math operations
- Event logging for transparency
