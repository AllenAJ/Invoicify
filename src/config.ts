import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import { sepolia } from "viem/chains";

export function paymentTokenAddress(chain: Chain | undefined): Address {
  switch (chain) {
    case undefined:
    case sepolia:
      // PYUSD ETH Sepolia
      return "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8";
    default:
      throw new Error(
        `Payment token address not configured for chain ${chain}`
      );
  }
}

// Moving our wagmi config here cleans up our App.tsx
// You can update App.tsx to import this.
export const wagmiConfig = getDefaultConfig({
  appName: "Invoice Factor",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});
