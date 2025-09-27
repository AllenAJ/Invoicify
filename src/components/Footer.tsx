import { extractChain } from "viem";
import { useChainId } from "wagmi";
import { wagmiConfig } from "../config";

export default function Footer() {
  const chainId = useChainId();
  const chain = extractChain({
    id: chainId,
    chains: wagmiConfig.chains,
  });

  return (
    <footer >

    </footer>
  );
}
