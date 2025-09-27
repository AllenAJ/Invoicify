import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { usePaymentTokenAddress } from './paymentToken';
import { CONTRACT_CONFIG, isContractDeployed, getContractAddress } from '@/config/contract';

// Contract ABI - you'll need to update this with the actual deployed contract address
const INVOICE_FACTORING_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_customer", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"},
      {"internalType": "uint256", "name": "_dueDate", "type": "uint256"},
      {"internalType": "string", "name": "_description", "type": "string"}
    ],
    "name": "createInvoiceFromData",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_invoiceId", "type": "uint256"}],
    "name": "factorInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_invoiceId", "type": "uint256"}],
    "name": "payInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "depositLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "withdrawLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collectReturns",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_invoiceId", "type": "uint256"}],
    "name": "getInvoice",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "business", "type": "address"},
          {"internalType": "address", "name": "customer", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "uint256", "name": "dueDate", "type": "uint256"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "bool", "name": "isFactored", "type": "bool"},
          {"internalType": "bool", "name": "isPaid", "type": "bool"},
          {"internalType": "uint256", "name": "factorAmount", "type": "uint256"},
          {"internalType": "address", "name": "factor", "type": "address"}
        ],
        "internalType": "struct InvoiceFactoring.Invoice",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_investor", "type": "address"}],
    "name": "getInvestor",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "totalDeposited", "type": "uint256"},
          {"internalType": "uint256", "name": "totalEarned", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct InvoiceFactoring.Investor",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAvailableLiquidity",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_invoiceAmount", "type": "uint256"}],
    "name": "calculateFactorAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  }
] as const;

// Use contract address from config
const INVOICE_FACTORING_ADDRESS = getContractAddress();

export interface InvoiceData {
  customer: string;
  amount: string;
  dueDate: string;
  description: string;
}

export function useInvoiceFactoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const paymentTokenAddress = usePaymentTokenAddress();

  // Create invoice from uploaded PDF data
  const createInvoiceFromData = async (invoiceData: InvoiceData) => {
    if (!address) throw new Error("No wallet connected");
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    const amount = parseUnits(invoiceData.amount, 6); // PYUSD has 6 decimals
    const dueDate = Math.floor(new Date(invoiceData.dueDate).getTime() / 1000);
    
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'createInvoiceFromData',
      args: [invoiceData.customer as `0x${string}`, amount, BigInt(dueDate), invoiceData.description],
    });
  };

  // Factor an invoice
  const factorInvoice = async (invoiceId: number) => {
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'factorInvoice',
      args: [BigInt(invoiceId)],
    });
  };

  // Pay an invoice
  const payInvoice = async (invoiceId: number) => {
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'payInvoice',
      args: [BigInt(invoiceId)],
    });
  };

  // Deposit liquidity
  const depositLiquidity = async (amount: string) => {
    const amountWei = parseUnits(amount, 6);
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'depositLiquidity',
      args: [amountWei],
    });
  };

  // Withdraw liquidity
  const withdrawLiquidity = async (amount: string) => {
    const amountWei = parseUnits(amount, 6);
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'withdrawLiquidity',
      args: [amountWei],
    });
  };

  // Collect returns
  const collectReturns = async () => {
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: INVOICE_FACTORING_ABI,
      functionName: 'collectReturns',
      args: [],
    });
  };

  return {
    createInvoiceFromData,
    factorInvoice,
    payInvoice,
    depositLiquidity,
    withdrawLiquidity,
    collectReturns,
  };
}

// Hook to read contract data
export function useInvoiceFactoringData() {
  const { address } = useAccount();

  // Get available liquidity
  const { data: availableLiquidity } = useReadContract({
    address: INVOICE_FACTORING_ADDRESS,
    abi: INVOICE_FACTORING_ABI,
    functionName: 'getAvailableLiquidity',
  });

  // Get investor data
  const { data: investorData } = useReadContract({
    address: INVOICE_FACTORING_ADDRESS,
    abi: INVOICE_FACTORING_ABI,
    functionName: 'getInvestor',
    args: address ? [address] : undefined,
  });

  return {
    availableLiquidity: availableLiquidity ? formatUnits(availableLiquidity, 6) : '0',
    investorData,
  };
}
