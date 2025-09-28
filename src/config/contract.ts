// Contract configuration
// Update this file after deploying the contract

export const CONTRACT_CONFIG = {
  // Deployed contract address on ETH Sepolia
  INVOICE_FACTORING_ADDRESS: "0x49FA36529E6802579d78ad033C459b78b7e7c814" as `0x${string}`,
  
  // Network configuration
  NETWORK: {
    name: "ETH Sepolia",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  
  // PYUSD token configuration
  PYUSD: {
    address: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" as `0x${string}`,
    decimals: 6,
    symbol: "PYUSD",
  },
  
  // Contract settings
  SETTINGS: {
    minFactorAmount: 50, // 50 PYUSD minimum
    factorRate: 80, // 80% advance rate
    profitRate: 20, // 20% profit for factors
  }
};

// Helper function to check if contract is deployed
export const isContractDeployed = () => {
  return CONTRACT_CONFIG.INVOICE_FACTORING_ADDRESS !== "0x0000000000000000000000000000000000000000";
};

// Helper function to get contract address
export const getContractAddress = () => {
  return CONTRACT_CONFIG.INVOICE_FACTORING_ADDRESS;
};
