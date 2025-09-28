import { useState, useCallback } from 'react';
import { createPublicClient, http, isAddress } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { normalize } from 'viem/ens';

interface ENSResult {
  address: string | null;
  name: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useENS() {
  const [result, setResult] = useState<ENSResult>({
    address: null,
    name: null,
    isLoading: false,
    error: null,
  });

  // Create public client for ENS resolution
  const publicClient = createPublicClient({
    chain: mainnet, // ENS is on mainnet
    transport: http(),
  });

  const resolveENS = useCallback(async (input: string): Promise<ENSResult> => {
    if (!input || input.trim() === '') {
      return {
        address: null,
        name: null,
        isLoading: false,
        error: null,
      };
    }

    const trimmedInput = input.trim();
    
    // Check if input is already a valid address
    if (isAddress(trimmedInput)) {
      try {
        setResult(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Try to get reverse ENS name for the address
        const name = await publicClient.getEnsName({
          address: trimmedInput as `0x${string}`,
        });

        const resolvedResult = {
          address: trimmedInput,
          name: name || null,
          isLoading: false,
          error: null,
        };
        
        setResult(resolvedResult);
        return resolvedResult;
      } catch (error) {
        const errorResult = {
          address: trimmedInput,
          name: null,
          isLoading: false,
          error: 'Failed to resolve reverse ENS name',
        };
        setResult(errorResult);
        return errorResult;
      }
    }

    // Check if input looks like an ENS name
    if (trimmedInput.includes('.') && trimmedInput.endsWith('.eth')) {
      try {
        setResult(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Normalize the ENS name
        const normalizedName = normalize(trimmedInput);
        
        // Resolve ENS name to address
        const address = await publicClient.getEnsAddress({
          name: normalizedName,
        });

        const resolvedResult = {
          address: address || null,
          name: normalizedName,
          isLoading: false,
          error: address ? null : 'ENS name not found or not registered',
        };
        
        setResult(resolvedResult);
        return resolvedResult;
      } catch (error) {
        const errorResult = {
          address: null,
          name: trimmedInput,
          isLoading: false,
          error: 'Failed to resolve ENS name',
        };
        setResult(errorResult);
        return errorResult;
      }
    }

    // Input doesn't look like an address or ENS name
    const invalidResult = {
      address: null,
      name: null,
      isLoading: false,
      error: 'Invalid address or ENS name format',
    };
    
    setResult(invalidResult);
    return invalidResult;
  }, [publicClient]);

  const clearResult = useCallback(() => {
    setResult({
      address: null,
      name: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...result,
    resolveENS,
    clearResult,
  };
}

// Helper function to validate ENS name format
export function isValidENSName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  
  // Basic ENS name validation
  const ensRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.eth$/i;
  return ensRegex.test(name);
}

// Helper function to get display text for address/ENS
export function getDisplayText(address: string | null, ensName: string | null): string {
  if (ensName) return ensName;
  if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
  return '';
}
