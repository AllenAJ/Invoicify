import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { usePaymentTokenAddress } from './paymentToken';
import { isContractDeployed, getContractAddress } from '@/config/contract';
import { InvoiceFactoringABI } from '@/abi/InvoiceFactoring';

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
      abi: InvoiceFactoringABI,
      functionName: 'createInvoiceFromData',
      args: [invoiceData.customer as `0x${string}`, amount, BigInt(dueDate), invoiceData.description],
    });
  };

  // Create a factored invoice directly (for liquidity pool approach)
  const createFactoredInvoice = async (invoiceData: InvoiceData) => {
    if (!address) throw new Error("No wallet connected");
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    const amount = parseUnits(invoiceData.amount, 6); // PYUSD has 6 decimals
    const dueDate = Math.floor(new Date(invoiceData.dueDate).getTime() / 1000);
    
    console.log('🔍 Creating factored invoice with params:', {
      customer: invoiceData.customer,
      amount: invoiceData.amount,
      amountWei: amount.toString(),
      dueDate: invoiceData.dueDate,
      dueDateUnix: dueDate,
      description: invoiceData.description,
      contractAddress: INVOICE_FACTORING_ADDRESS
    });
    
    try {
      const hash = await writeContract({
        address: INVOICE_FACTORING_ADDRESS,
        abi: InvoiceFactoringABI,
        functionName: 'createFactoredInvoice',
        args: [invoiceData.customer as `0x${string}`, amount, BigInt(dueDate), invoiceData.description],
      });
      
      console.log('✅ Contract transaction submitted:', hash);
      
      // For now, return the transaction hash
      // In a production app, you'd wait for the transaction to be mined and parse the event logs
      // to get the actual invoice ID. For simplicity, we'll use a placeholder.
      return hash;
    } catch (error) {
      console.error('❌ Contract transaction failed:', error);
      throw error;
    }
  };

  // Factor an invoice
  const factorInvoice = async (invoiceId: number) => {
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'factorInvoice',
      args: [BigInt(invoiceId)],
    });
  };

  // Pay an invoice (1 PYUSD to liquidity pool)
  const payInvoice = async (invoiceId: number) => {
    if (!address) throw new Error("No wallet connected");
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'payInvoice',
      args: [BigInt(invoiceId)],
    });
  };

  // Pay PYUSD directly to liquidity pool (for customer payments)
  const payToLiquidityPool = async (paymentAmount: string = "10") => {
    if (!address) throw new Error("No wallet connected");
    if (!isContractDeployed()) throw new Error("Contract not deployed yet. Please deploy the contract first.");
    
    const amount = paymentAmount; // Configurable PYUSD payment amount
    const amountWei = parseUnits(amount, 6);
    
    // First, approve the contract to spend PYUSD
    await writeContract({
      address: paymentTokenAddress,
      abi: [
        {
          "inputs": [
            {"internalType": "address", "name": "spender", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "approve",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      functionName: 'approve',
      args: [INVOICE_FACTORING_ADDRESS, amountWei],
    });
    
    // Wait a moment for approval to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Then deposit 1 PYUSD to liquidity pool
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'depositLiquidity',
      args: [amountWei],
    });
  };

  // Deposit liquidity
  const depositLiquidity = async (amount: string) => {
    const amountWei = parseUnits(amount, 6);
    
    // First, approve the contract to spend PYUSD
    await writeContract({
      address: paymentTokenAddress,
      abi: [
        {
          "inputs": [
            {"internalType": "address", "name": "spender", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "approve",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      functionName: 'approve',
      args: [INVOICE_FACTORING_ADDRESS, amountWei],
    });
    
    // Wait a moment for approval to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Then deposit liquidity
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'depositLiquidity',
      args: [amountWei],
    });
  };

  // Withdraw liquidity
  const withdrawLiquidity = async (amount: string) => {
    const amountWei = parseUnits(amount, 6);
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'withdrawLiquidity',
      args: [amountWei],
    });
  };

  // Collect returns
  const collectReturns = async () => {
    return writeContract({
      address: INVOICE_FACTORING_ADDRESS,
      abi: InvoiceFactoringABI,
      functionName: 'collectReturns',
      args: [],
    });
  };

  return {
    createInvoiceFromData,
    createFactoredInvoice,
    factorInvoice,
    payInvoice,
    payToLiquidityPool,
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
    abi: InvoiceFactoringABI,
    functionName: 'getAvailableLiquidity',
  });

  // Get investor data
  const { data: investorData } = useReadContract({
    address: INVOICE_FACTORING_ADDRESS,
    abi: InvoiceFactoringABI,
    functionName: 'getInvestor',
    args: address ? [address] : undefined,
  });

  return {
    availableLiquidity: availableLiquidity ? formatUnits(availableLiquidity, 6) : '0',
    investorData,
  };
}
