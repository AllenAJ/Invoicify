# Deployment Guide

## Prerequisites

1. **Get API Keys:**
   - Infura API Key: https://infura.io/
   - Etherscan API Key: https://etherscan.io/apis

2. **Get ETH Sepolia Testnet ETH:**
   - Use a faucet: https://sepoliafaucet.com/
   - You'll need ETH for gas fees

3. **Get PYUSD on ETH Sepolia:**
   - PYUSD Address: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`
   - You can get test PYUSD from PayPal or use a testnet faucet

## Environment Setup

Create a `.env` file in the `contracts/` directory:

```bash
# Copy this to contracts/.env
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Deployment Steps

1. **Install Dependencies:**
   ```bash
   cd contracts
   forge install
   ```

2. **Build Contract:**
   ```bash
   forge build
   ```

3. **Run Tests:**
   ```bash
   forge test
   ```

4. **Deploy to ETH Sepolia:**
   ```bash
   forge script script/DeployInvoiceFactoring.s.sol --rpc-url sepolia --broadcast --verify
   ```

5. **Update Frontend:**
   - Copy the deployed contract address
   - Update `src/hooks/invoiceFactoring.ts` with the real address
   - Replace `0x0000000000000000000000000000000000000000` with the deployed address

## Contract Address

After deployment, you'll get a contract address like:
`0x1234567890123456789012345678901234567890`

Update this in the frontend configuration.

## Testing

1. **Connect Wallet** to ETH Sepolia
2. **Get PYUSD** tokens for testing
3. **Upload PDF** and create invoice
4. **Deposit liquidity** as investor
5. **Factor invoice** and test the flow
