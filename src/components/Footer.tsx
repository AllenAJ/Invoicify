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
    <footer className='overflow-clip text-sm text-gray-500 space-y-1 border-2 border-zinc-500 border-opacity-50 p-3'>
      <p>
        This is an{" "}
        <a href='https://github.com/mono-koto/build-with-pyusd'>open source</a>{" "}
        project that you can create and hack on yourself!
      </p>
      <p>
        Check out our{" "}
        <a href='https://build.pyusd.to/'>PYUSD builders guides</a> to get
        started.
      </p>
      <p>
        Created with 💛 by <a href='https://mono-koto.com'>Mono Koto</a> in
        collaboration with <a href='https://gardenlabs.xyz'>Garden Labs</a>.
      </p>

      <p>Current network: {chain?.name || "Unknown network"}</p>
      <p>Invoice Factor - PYUSD Factoring Platform</p>
    </footer>
  );
}
