#!/bin/bash

# Invoice Factoring Contract Deployment Script
# Make sure to set up your .env file first!

echo "🚀 Deploying Invoice Factoring Contract to ETH Sepolia..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your API keys and private key."
    echo "See DEPLOYMENT.md for instructions."
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$PRIVATE_KEY" ] || [ -z "$INFURA_API_KEY" ] || [ -z "$ETHERSCAN_API_KEY" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please set PRIVATE_KEY, INFURA_API_KEY, and ETHERSCAN_API_KEY in your .env file."
    exit 1
fi

echo "✅ Environment variables loaded"

# Build the contract
echo "🔨 Building contract..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Contract built successfully"

# Run tests
echo "🧪 Running tests..."
forge test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi

echo "✅ All tests passed"

# Deploy to ETH Sepolia
echo "🚀 Deploying to ETH Sepolia..."
forge script script/DeployInvoiceFactoring.s.sol --rpc-url sepolia --broadcast --verify

if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the deployed contract address from the output above"
    echo "2. Update src/hooks/invoiceFactoring.ts with the contract address"
    echo "3. Replace '0x0000000000000000000000000000000000000000' with your deployed address"
    echo "4. Test the frontend with the deployed contract"
else
    echo "❌ Deployment failed!"
    exit 1
fi
